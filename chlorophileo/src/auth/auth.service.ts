import { Inject, Injectable, NotFoundException, UnauthorizedException, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt'
import { bcryptConstants, jwtConstants } from './constants';
import { User } from 'src/user/user.model';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class AuthService {
    constructor(
        // @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly sequelize: Sequelize
    ) {}

    async signIn(email: string, password: string): Promise<any> {
        const user = await this.userService.getUserByEmail(email)

        if (!user) throw new NotFoundException({ message: 'User not found' })
        if (!await this.isPaswordMatch(password, user.dataValues.password))
            throw new UnauthorizedException()

        return await this.authenticateUser(user)
    }

    async register(data: any): Promise<User|null> {
        const user = {
            email: data.email,
            password: data.password
        }
        return this.userService.register(user)
    }

    async signOut(id: string): Promise<void> {
        const t = await this.sequelize.transaction()

        try {
            const isUser = await this.userService.getUser(id)
            if (!isUser) throw new UnauthorizedException()

            const user = { tokenRevokedBefore: new Date() }
            await isUser.update(user, { transaction: t })
            await t.commit()
        } catch (error) {
            await t.rollback()
            throw error
        }
    }

    private async authenticateUser(user: User): Promise<any> {
		const payload = { sub: user.id, email: user.email, expireAt: this.computeExpireAt() }
        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }

	private computeExpireAt(): Date {
		const raw = jwtConstants.expiresIn || '24h'

		let milliseconds: number
		if (typeof raw === 'number') {
			milliseconds = raw * 1000
		} else if (/^\d+$/.test(raw)) {
			milliseconds = Number(raw) * 1000
		} else if (/^\d+ms$/.test(raw)) {
			milliseconds = parseInt(raw)
		} else if (/^\d+s$/.test(raw)) {
			milliseconds = parseInt(raw) * 1000
		} else if (/^\d+m$/.test(raw)) {
			milliseconds = parseInt(raw) * 60 * 1000
		} else if (/^\d+h$/.test(raw)) {
			milliseconds = parseInt(raw) * 60 * 60 * 1000
		} else if (/^\d+d$/.test(raw)) {
			milliseconds = parseInt(raw) * 24 * 60 * 60 * 1000
		} else {
			milliseconds = 24 * 60 * 60 * 1000
		}

		return new Date(Date.now() + milliseconds)
	}

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, bcryptConstants.saltOrRounds)
    }

    private async isPaswordMatch(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash)
    }
}
