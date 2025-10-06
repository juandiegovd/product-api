import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class ActiveProductQuery {
  @IsDateString()
  @ApiProperty()
  minDate: string;

  @IsDateString()
  @ApiProperty()
  maxDate: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  maxPrice?: number;
}
