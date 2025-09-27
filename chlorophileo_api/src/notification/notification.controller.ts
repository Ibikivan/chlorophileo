import { Controller, HttpCode, HttpStatus, Req, UseGuards } from '@nestjs/common'
import { Body, Param, Get, Delete, Patch } from '@nestjs/common'
import { NotificationService } from './notification.service'
import { AuthGuard } from '../auth/auth.guard'

@UseGuards(AuthGuard)
@Controller('notification')
export class NotificationController {
	constructor(private readonly notificationService: NotificationService) {}

    @HttpCode(HttpStatus.NO_CONTENT)
	@Patch(':id/read')
	async markAsRead(@Param('id') id: string) {
		await this.notificationService.markAsRead(id)
	}

    @Get('user/:userId') // Add a read status filter
    async getNotificationsByUserId(@Param('userId') userId: string, @Body('status') status?: string) {
        return this.notificationService.getNotificationsByPlantId(userId, status)
	}

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('/:id')
    async deleteNotificationsByUserId(@Param('id') id: string, @Req() req,) {
        const userId = req.user.sub
        await this.notificationService.deleteNotificationsByPlantId(id, userId)
	}

	@Get('pending')
	async getPendingNotifications(@Req() req) {
        const userId = req.user.sub
		return this.notificationService.getPendingNotifications(userId)
	}
}
