import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { FindOptions, Transaction } from 'sequelize'
import { Plant } from './plant.model'

export interface PaginationQuery {
  page?: number
  limit?: number
}

export interface PaginatedPlantsResult {
  data: Plant[]
  pagination: {
    page: number
    limit: number
    totalItems: number
    totalPages: number
  }
}

@Injectable()
export class PlantRepository {
  constructor(
    @InjectModel(Plant)
    private readonly plantModel: typeof Plant
  ) {}

  async createPlant(payload: Partial<Plant>, transaction?: Transaction): Promise<Plant> {
    return this.plantModel.create(payload as any, { transaction })
  }

  async updatePlant(id: string, userId: string, payload: Partial<Plant>): Promise<[number, Plant[]]> {
    return this.plantModel.update(payload, { where: { id, userId }, returning: true })
  }

  async getPlant(id: string, userId: string, options: FindOptions<Plant> = {}): Promise<Plant | null> {
    return this.plantModel.findOne({ where: { id, userId }, ...options })
  }

  async getPlantsPaginated(query: PaginationQuery, userId: string): Promise<PaginatedPlantsResult> {
    const page = Math.max(1, Number(query.page) || 1)
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 10))
    const offset = (page - 1) * limit

    const { rows, count } = await this.plantModel.findAndCountAll({
      limit,
      offset,
      where: { userId },
      order: [['createdAt', 'DESC']]
    })

    return {
      data: rows,
      pagination: {
        page,
        limit,
        totalItems: count,
        totalPages: Math.max(1, Math.ceil(count / limit))
      }
    }
  }

  async deletePlant(id: string, userId: string): Promise<number> {
    return this.plantModel.destroy({ where: { id, userId } })
  }
}


