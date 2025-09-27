import * as dotenv from 'dotenv'
dotenv.config()

export const jwtConstants = {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRE_IN
}

export const bcryptConstants = {
    saltOrRounds: 10
}