import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductQuery } from './dto/product-query.request';
import { Cron } from '@nestjs/schedule';
import { PaginationQuery } from '@common/pagination/pagination-query';
import { Public } from '@common/decorators/public.decorator';

@Controller('product')
@Public()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Cron('0 * * * *')
  async syncProducts() {
    await this.productService.syncProducts();
  }

  @Get()
  async getProducts(
    @Query() query: ProductQuery,
    @Query() pagination: PaginationQuery,
  ) {
    return await this.productService.getAllProducts(query, pagination);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: number) {
    await this.productService.deleteProduct(id);
  }
}
