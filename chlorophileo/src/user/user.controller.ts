import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard'

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getUsers() {
        return await this.userService.getUsers()
    }

    @UseGuards(AuthGuard)
    @Get('/me')
    async getUser(@Req() req) {
        const id = req.user.sub
        return await this.userService.getUser(id)
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Patch('update')
    async updateUser(@Req() req, @Body() updateDto: Record<string, any>) {
        const id = req.user.sub
        await this.userService.update(id, updateDto)
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(AuthGuard)
    @Delete('delete')
    async deleteUser(@Req() req) {
        const id = req.user.sub
        await this.userService.delete(id)
    }
}
