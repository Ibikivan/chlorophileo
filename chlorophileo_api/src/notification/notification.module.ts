import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationRepository } from './notification.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { Notification } from './notification.model';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    SequelizeModule.forFeature([Notification])
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository],
  exports: [NotificationService]
})
export class NotificationModule {}
