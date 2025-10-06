import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginRequest {
    @ApiProperty({example: "john.doe@example.com"})
    @IsString()
    username: string;
    @ApiProperty({example: "really-hard-password"})
    @IsString()
    password: string;
}