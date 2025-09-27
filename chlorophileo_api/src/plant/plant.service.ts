import { Injectable, NotFoundException } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript'
import { Plant } from './plant.model'
import { PlantRepository, PaginatedPlantsResult } from './plant.repository'
import { WateringService } from 'src/watering/watering.service'

@Injectable()
export class PlantService {
    constructor(
        private readonly plantRepo: PlantRepository,
        private readonly sequelize: Sequelize,
        private readonly wateringService: WateringService
    ) {}

    async create(userId: string, data: Partial<Plant>): Promise<Plant> {
        const t = await this.sequelize.transaction()
        
        try {
            let payload: Partial<Plant> = { ...data, userId }
            if (!payload.species) payload.species = payload.name
            const plant = await this.plantRepo.createPlant(payload, t)

            // Create a watering which starts a cron job to send mail
            await this.wateringService.createWatering(plant.dataValues.id, plant.dataValues.frequency, t)

            await t.commit()
            return plant
        } catch (error) {
            await t.rollback()
            throw error
        }
    }

    async update(userId: string, id: string, data: Partial<Plant>): Promise<void> {
        const t = await this.sequelize.transaction()

        try {
            let payload: Partial<Plant> = {}

            const plant = await this.plantRepo.getPlant(id, userId)
            if (!plant) throw new NotFoundException()
            
            if (data.name) payload.name = data.name
            if (data.species) payload.species = data.species
            if (data.imageUrl) payload.imageUrl = data.imageUrl
            if (data.waterAmount) payload.waterAmount = data.waterAmount
            if (data.frequency) payload.frequency = data.frequency

            await plant.update(payload, { transaction: t })
            if (data.frequency || data.waterAmount) {
                // Update the current watering schedule
                // TODO: Update existing watering frequency/amount
            }

            await t.commit()
        } catch (error) {
            await t.rollback()
            throw error
        }
    }

    async findOne(userId: string, id: string): Promise<Plant | null> {
        return await this.plantRepo.getPlant(id, userId)
    }

    async findAll(userId: string, page?: number, limit?: number): Promise<PaginatedPlantsResult> {
        return this.plantRepo.getPlantsPaginated({ page, limit }, userId)
    }

    async remove(userId: string, id: string): Promise<void> {
        const plant = await this.plantRepo.getPlant(id, userId)
        if (!plant) throw new NotFoundException()

        // soft delete this plant watering for prevent useless chron work
        await this.wateringService.deleteWateringsByPlantId(plant.id)
        await plant.destroy()
    }
}
