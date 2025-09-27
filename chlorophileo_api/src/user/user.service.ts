import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { bcryptConstants } from 'src/auth/constants'
import { Sequelize } from 'sequelize-typescript';
import { User } from './user.model';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly sequelize: Sequelize,
    ) {}

    async getUsers(): Promise<User[]> {
        return await this.userRepo.getUsers()
    }

    async getUser(id: string): Promise<User|null> {
        const user = await this.userRepo.getUser(id)
        console.log({user: user, userId: id})
        return user
    }

    async getUserByEmail(email: string): Promise<User|null> {
        return await this.userRepo.getByEmail(email)
    }

    async register(data: any): Promise<User|null> {
        const t = await this.sequelize.transaction()
        try {
            const isUser = await this.userRepo.getByEmail(data.email)
            if (isUser) throw new ConflictException()

            const user = {
                email: data.email,
                password: await bcrypt.hash(data.password, bcryptConstants.saltOrRounds)
            }
            const createdUser = await this.userRepo.createUser(user, t)
            await t.commit()
            return createdUser
        } catch (error) {
            await t.rollback()
            throw error
        }
    }

    async update(id: string, data: any) {
        const t = await this.sequelize.transaction()
        try {
            let user: any = {}
            const isUser = await this.userRepo.getUser(id)
            if (!isUser) throw new NotFoundException()

            if (data.email) {
                if (data.email === isUser.dataValues.email) throw new BadRequestException("Privious an current values are the same")
                user.email = data.email
            }
            if (data.password) {
                if (data.password === isUser.dataValues.password) throw new BadRequestException("Privious an current values are the same")
                user.password = await bcrypt.hash(data.password, bcryptConstants.saltOrRounds)
            }

            await isUser.update(user, { transaction: t })
            // await this.authService.signOut(id)

            await t.commit()
        } catch (error) {
            await t.rollback()
            throw error
        }
    }

    async delete(id: string) {
        const t = await this.sequelize.transaction();
        try {
            const isUser = await this.userRepo.getUser(id);
            if (!isUser) throw new NotFoundException();

            // await this.authService.signOut(id)

            await this.userRepo.delete(id, t);
            await t.commit();
        } catch (error) {
            await t.rollback();
            throw error;
        }  
    }
}
