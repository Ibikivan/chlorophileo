import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto: Record<string, any>) {
        return await this.authService.signIn(signInDto.email, signInDto.password)
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        return await req.user
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    async register(@Body() registerDto: Record<string, any>) {
        return await this.authService.register(registerDto)
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Patch('logout')
    async signOut(@Request() req) {
        await this.authService.signOut(req.user.sub)
    }

}
