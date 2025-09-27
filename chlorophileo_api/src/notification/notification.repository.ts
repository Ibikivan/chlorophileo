import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Notification } from './notification.model';
import { Transaction } from 'sequelize';

@Injectable()
export class NotificationRepository {
    constructor(
        @InjectModel(Notification)
        private readonly notificationModel: typeof Notification
    ) {}

    async createNotification(data: Partial<Notification>, t: Transaction|null = null): Promise<Notification> {
        return this.notificationModel.create(data as any, { transaction: t });
    }

    async getNotification(id: string): Promise<Notification|null> {
        return this.notificationModel.findByPk(id);
    }

    async getNotificationsByPlantId(plantId: string, status?: string): Promise<Notification[]> {
        const where: any = { userId: plantId };
        if (status === 'Read') where.read = true;
        if (status === 'Unread') where.read = false;
        return this.notificationModel.findAll({ where });
    }

    async deleteNotificationsByPlantId(id: string, userId: string, t?: Transaction): Promise<void> {
        await this.notificationModel.destroy({ where: { id, userId }, transaction: t });
    }

    async getPendingNotifications(userId: string): Promise<Notification[]> {
        return this.notificationModel.findAll({ where: { userId, read: false } });
    }
}
