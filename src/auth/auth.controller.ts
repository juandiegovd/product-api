import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '@common/decorators/public.decorator';
import { LoginRequest } from './dto/login.request';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @Public()
    async logIn(@Body() request: LoginRequest): Promise<any> {
        return await this.authService.signIn(request.username, request.password);
    }
}
