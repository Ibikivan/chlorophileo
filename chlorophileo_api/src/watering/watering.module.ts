import { Module } from '@nestjs/common';
import { WateringController } from './watering.controller';
import { WateringService } from './watering.service';
import { WateringRepository } from './watering.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { Watering } from './watering.model';
import { UserModule } from 'src/user/user.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    UserModule,
    NotificationModule,
    SequelizeModule.forFeature([Watering])
  ],
  controllers: [WateringController],
  providers: [WateringService, WateringRepository],
  exports: [WateringService]
})
export class WateringModule {}
