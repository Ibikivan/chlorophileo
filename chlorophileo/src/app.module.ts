import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PlantModule } from './plant/plant.module';
import { FilesController } from './files/files.controller';
import { WateringModule } from './watering/watering.module';
import { NotificationModule } from './notification/notification.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MailerModule } from '@nestjs-modules/mailer';
import { emailAccess } from './common/utils/app.constants';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: emailAccess.host,
        port: emailAccess.port,
        secure: emailAccess.secure,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      defaults: {
        from: '"Chlorophileo" <no-reply@chlorophileo.com>',
      }
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    ScheduleModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      synchronize: true,
      // sync: { force: true }
    }),
    UserModule,
    AuthModule,
    PlantModule,
    WateringModule,
    NotificationModule
  ],
  controllers: [FilesController],
  providers: [],
})
export class AppModule {}