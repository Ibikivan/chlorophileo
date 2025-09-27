import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./user.model";
import { Transaction } from "sequelize";

@Injectable()
export class UserRepository {
    constructor(
        @InjectModel(User)
        private readonly userModel: typeof User
    ) {}

    async getUsers(): Promise<User[]> {
        return await this.userModel.findAll()
    }

    async getUser(id: string): Promise<User|null> {
        return await this.userModel.findByPk(id)
    }

    async getByEmail(email: string): Promise<User|null> {
        return await this.userModel.findOne({
            where: { email: email }
        })
    }

    async createUser(user: any, transaction: any|null = null): Promise<User|null> {
        return await this.userModel.create(user, { transaction })
    }

    async update(id: string, user: any, transaction: any|null = null): Promise<any> {
        return await this.userModel.update(user, {
            where: { id: id },
            transaction
        })
    }

    async delete(id: string, transaction: any|null = null): Promise<any> {
        return await this.userModel.destroy({
            where: { id: id },
            transaction
        })
    }
}
