import { Module } from '@nestjs/common';
import { PlantController } from './plant.controller';
import { PlantService } from './plant.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Plant } from './plant.model';
import { PlantRepository } from './plant.repository';
import { UserModule } from 'src/user/user.module';
import { WateringModule } from 'src/watering/watering.module';

@Module({
  imports: [
    UserModule,
    WateringModule,
    SequelizeModule.forFeature([Plant])
  ],
  controllers: [PlantController],
  providers: [PlantService, PlantRepository],
  exports: [PlantService]
})
export class PlantModule {}
