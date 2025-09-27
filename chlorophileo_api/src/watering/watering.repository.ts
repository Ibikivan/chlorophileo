import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { FindOptions, Transaction } from 'sequelize'
import { Watering } from './watering.model'

@Injectable()
export class WateringRepository {
  constructor(
    @InjectModel(Watering)
    private readonly wateringModel: typeof Watering
  ) {}

  async createWatering(payload: Partial<Watering>, transaction?: Transaction): Promise<Watering> {
    return this.wateringModel.create(payload as any, { transaction })
  }

  async updateWatering(id: string, payload: Partial<Watering>, transaction?: Transaction): Promise<[number, Watering[]]> {
    return this.wateringModel.update(payload, { where: { id }, returning: true, transaction })
  }

  async getWatering(id: string, options: FindOptions<Watering> = {}): Promise<Watering | null> {
    return this.wateringModel.findByPk(id, options)
  }

  async getWateringsByPlantId(plantId: string, status?: string): Promise<Watering[]> {
    const where: any = { plantId }
    if (status) where.status = status
    return this.wateringModel.findAll({
      where,
      order: [['createdAt', 'DESC']]
    })
  }

  async getPendingWaterings(): Promise<Watering[]> {
    return this.wateringModel.findAll({
      where: { status: 'Pending' },
      include: ['plant']
    })
  }

  async deleteWatering(id: string, transaction?: Transaction): Promise<number> {
    return this.wateringModel.destroy({ where: { id }, transaction })
  }

  async deleteWateringsByPlantId(plantId: string, transaction?: Transaction): Promise<number> {
    return this.wateringModel.destroy({ where: { plantId }, transaction })
  }
}
