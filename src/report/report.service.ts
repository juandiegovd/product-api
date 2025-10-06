import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Content } from '../entities/content.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReportService {
    constructor(
        @InjectRepository(Content) private readonly contentRepository: Repository<Content>
    ) {}

    public async getInactiveProductsPercentage(): Promise<number> {
        const totalProducts = await this.contentRepository.count();
        if (totalProducts === 0) return 0;
        const inactiveProducts = await this.contentRepository.countBy({active: false});
        return Math.round((inactiveProducts / totalProducts) * 100);
    }

    public async getActiveProductsPercentage(minDate: Date, maxDate: Date, minPrice?: number, maxPrice?: number): Promise<number> {
        const totalProducts = await this.contentRepository.count();
        if (totalProducts === 0) return 0;
        const activeProducts = await this.contentRepository.createQueryBuilder('content')
                                .where('content.active = :active', {active: true})
                                .andWhere('content.createdAt BETWEEN :minDate AND :maxDate', { minDate: minDate, maxDate: maxDate })
                                .andWhere(minPrice ? 'content.price >= :minPrice' : '1=1', { minPrice: minPrice })
                                .andWhere(maxPrice ? 'content.price <= :maxPrice' : '1=1', { maxPrice: maxPrice })
                                .getCount();
        return Math.round((activeProducts / totalProducts) * 100);
    }
    
    public async getAveragePriceOfActiveProducts(): Promise<number> {
        const result = await this.contentRepository.createQueryBuilder('content')
                            .select('AVG(content.price)', 'avg')
                            .where('content.active = :active', {active: true})
                            .getRawOne();
        return Math.round(parseFloat(result.avg)*100)/100;
    }
}
