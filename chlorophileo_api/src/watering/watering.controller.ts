import { Controller, Get, HttpCode, HttpStatus, Param, Patch, Query, UseGuards } from '@nestjs/common'
import { WateringService } from './watering.service'
import { AuthGuard } from 'src/auth/auth.guard'

@UseGuards(AuthGuard)
@Controller('watering')
export class WateringController {
    constructor(private readonly wateringService: WateringService) {}

    @Get('plant/:plantId')
    async getWateringsByPlantId(@Param('plantId') plantId: string, @Query('status') status?: string) {
        return this.wateringService.getWateringsByPlantId(plantId, status)
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Patch('/:id/complete')
    async markAsCompleted(@Param('id') id: string) {
        await this.wateringService.markAsCompleted(id)
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Patch('/:id/missed')
    async markAsMissed(@Param('id') id: string) {
        await this.wateringService.markAsMissed(id)
    }

    @Patch('trigger-check')
    async triggerWateringCheck() {
        await this.wateringService.triggerWateringCheck()
        return { message: 'Watering check triggered' }
    }
}
