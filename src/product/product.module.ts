import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from '../entities/content.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Content])],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
