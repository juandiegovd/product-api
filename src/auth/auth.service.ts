import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(private readonly jwtService: JwtService) {}

    async signIn(username: string, password: string): Promise<any> {
        const payload = {sub: username, user: username};
        return {
            accessToken: await this.jwtService.signAsync(payload)
        };
    }
}
