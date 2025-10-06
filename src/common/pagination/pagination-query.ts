import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsPositive } from "class-validator";

export class PaginationQuery {
    @ApiPropertyOptional()
    @IsOptional()
    @IsPositive()
    limit?: number;


    @ApiPropertyOptional()
    @IsOptional()
    @IsPositive()
    page?: number;
}