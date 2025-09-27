import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { Sequelize } from 'sequelize-typescript'
import { WateringRepository } from './watering.repository'
import { Watering } from './watering.model'
import { NotificationService } from 'src/notification/notification.service'
import { MailerService } from '@nestjs-modules/mailer'
import { UserService } from 'src/user/user.service'

@Injectable()
export class WateringService {
    constructor(
        private readonly wateringRepo: WateringRepository,
        private readonly sequelize: Sequelize,
        private readonly notificationService: NotificationService,
        private readonly mailerService: MailerService,
        private readonly userService: UserService
    ) {}

    async createWatering(plantId: string, frequency: number, t: any): Promise<Watering> {
        const normalizedHours = Number(frequency)
        
        if (!Number.isFinite(normalizedHours) || normalizedHours <= 0)
            throw new BadRequestException()

        const nextWateringDate = new Date(Date.now() + normalizedHours * 60 * 60 * 1000)

        const watering = await this.wateringRepo.createWatering({
            plantId,
            date: nextWateringDate,
            status: 'Pending'
        }, t)
        return watering
    }

    async markAsCompleted(id: string): Promise<void> {
        const t = await this.sequelize.transaction()
        
        try {
            const watering = await this.wateringRepo.getWatering(id)
            if (!watering) throw new NotFoundException()
            if (watering.dataValues.status === 'Completed') throw new ConflictException('Watering already completed')

            await watering.update({ status: 'Completed' }, { transaction: t })
            
            // Create next watering based on plant frequency
            let plant: any = (watering as any).plant
            if (!plant && typeof (watering as any).getPlant === 'function') {
                plant = await (watering as any).getPlant()
            }

            const normalizedHours = Number(plant.dataValues.frequency)
            if (!Number.isFinite(normalizedHours) || normalizedHours <= 0)
                throw new BadRequestException('Invalid plant frequency')

            const nextWateringDate = new Date(Date.now() + normalizedHours * 60 * 60 * 1000)
            await this.wateringRepo.createWatering({ plantId: plant.dataValues.id, date: nextWateringDate, status: 'Pending' }, t)
            
            await t.commit()
        } catch (error) {
            await t.rollback()
            throw error
        }
    }

    async markAsMissed(id: string): Promise<void> {
        const watering = await this.wateringRepo.getWatering(id)
        if (!watering) throw new NotFoundException()
        watering.update({ status: 'Missed' })
    }

    async getWateringsByPlantId(plantId: string, status?: string): Promise<Watering[]> {
        return this.wateringRepo.getWateringsByPlantId(plantId, status)
    }

    async deleteWateringsByPlantId(plantId: string): Promise<void> {
        const t = await this.sequelize.transaction()
        
        try {
            await this.wateringRepo.deleteWateringsByPlantId(plantId, t)
            await t.commit()
        } catch (error) {
            await t.rollback()
            throw error
        }
    }

    @Cron(CronExpression.EVERY_HOUR)
    async checkPendingWaterings(): Promise<void> {
        const pendingWaterings = await this.wateringRepo.getPendingWaterings()
        const now = new Date()

        for (const watering of pendingWaterings) {
            if (watering.dataValues.date <= now) {
                // Mark as missed if past due
                await this.markAsMissed(watering.dataValues.id)
                
                const plant = watering.get('plant')
                await this.notificationService.createNotification(
                    plant.dataValues.userId,
                    plant.dataValues.id,
                    `Il est temp d'arroser votre ${plant.dataValues.name} !`
                )

                const user = await this.userService.getUser(plant.dataValues.userId)
                if (!user) throw new NotFoundException('Unable to find the user to remind')

                const email = {
                    to: user.dataValues.email,
                    subject: "Chlorophileo - Rappel",
                    text: `Hey ! Salut toi !
                    Il est temps d'arroser ton magnifique ${plant.dataValues.name} 🌺;
                    Je suis sure que tu ne veux pas le voir faner 🥀.
                    🌞 allez, il n'attend que toi.🌞
                    `,
                }
                await this.sendEmail(email.to, email.subject, email.text)
            }
        }
    }

    async sendEmail(to: string, subject: string, text: string, html?: string) {
        await this.mailerService.sendMail({
          to: to,
          subject: subject,
          text: text,
          html: html
        });
        console.log('Email sent successfully!');
    }

    // Manual cron job trigger for testing
    async triggerWateringCheck(): Promise<void> {
        await this.checkPendingWaterings()
    }
}
