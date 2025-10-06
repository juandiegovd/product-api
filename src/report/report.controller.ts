import { Controller, Get, Query } from '@nestjs/common';
import { ReportService } from './report.service';
import { ActiveProductQuery } from './dto/active-product-query.request';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('report')
@ApiBearerAuth('access-token')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('inactive-percentage')
  async getInactiveProducts() {
    return await this.reportService.getInactiveProductsPercentage();
  }

  @Get('active-percentage')
  async getActiveProducts(@Query() query: ActiveProductQuery) {
    const minDate = new Date(query.minDate);
    const maxDate = new Date(query.maxDate);
    return await this.reportService.getActiveProductsPercentage(
      minDate,
      maxDate,
      query.minPrice,
      query.maxPrice,
    );
  }

  @Get('average-price')
  getAveragePriceOfActiveProducts() {
    return this.reportService.getAveragePriceOfActiveProducts();
  }
}
