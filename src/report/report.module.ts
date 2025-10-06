import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from '../entities/content.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Content])],
  providers: [ReportService],
  controllers: [ReportController]
})
export class ReportModule {}
