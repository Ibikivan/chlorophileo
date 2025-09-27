import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { UserRepository } from './user.repository';

@Module({
    imports: [
        SequelizeModule.forFeature([User])
    ],
    controllers: [UserController],
    providers: [
        UserService,
        UserRepository
    ],
    exports: [UserService, UserRepository]
})
export class UserModule {}
