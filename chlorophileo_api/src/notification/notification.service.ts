import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { NotificationRepository } from './notification.repository'
import { Sequelize } from 'sequelize-typescript'
import { Notification } from './notification.model'

@Injectable()
export class NotificationService {
	constructor(
		private readonly notificationRepo: NotificationRepository,
		private readonly sequelize: Sequelize
	) {}

	async createNotification(
        userId: string,
        plantId: string,
        message: string
    ): Promise<Notification> {
		return this.notificationRepo.createNotification({
            userId,
            plantId,
            message
        })
	}

	async markAsRead(id: string): Promise<void> {
			const t = await this.sequelize.transaction()
			try {
				const notification = await this.notificationRepo.getNotification(id)
				if (!notification) throw new NotFoundException()
                if (notification.dataValues.read) throw new ConflictException()

				await notification.update({ read: true }, { transaction: t })
				await t.commit()
			} catch (error) {
				await t.rollback()
				throw error
			}
	}

	async getNotificationsByPlantId(plantId: string, status?: string): Promise<Notification[]> {
		return this.notificationRepo.getNotificationsByPlantId(plantId, status)
	}

	async deleteNotificationsByPlantId(id: string, userId: string): Promise<void> {
			const t = await this.sequelize.transaction()
			try {
				await this.notificationRepo.deleteNotificationsByPlantId(id, userId, t)
				await t.commit()
			} catch (error) {
				await t.rollback()
				throw error
			}
	}

	async getPendingNotifications(userId: string): Promise<Notification[]> {
		return this.notificationRepo.getPendingNotifications(userId)
	}
}
