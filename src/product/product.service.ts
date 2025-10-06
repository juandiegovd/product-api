import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, map, mergeMap } from 'rxjs';
import { IContentfulResponse } from './dto/contentful.response';
import { Content } from '../entities/content.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQuery } from '@common/pagination/pagination-query';
import { ProductQuery } from './dto/product-query.request';

@Injectable()
export class ProductService {
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        @InjectRepository(Content) private readonly contentRepository: Repository<Content>,
    ) {}

    private readonly logger = new Logger(ProductService.name);

    public async syncProducts() {
        this.logger.debug('Syncing products from Contentful API');
        const spaceId = this.configService.get<string>('CONTENTFUL_SPACE_ID');
        const accessToken = this.configService.get<string>('CONTENTFUL_ACCESS_TOKEN');
        const environment = this.configService.get<string>('CONTENTFUL_ENVIRONMENT');
        const contentType = this.configService.get<string>('CONTENTFUL_CONTENT_TYPE');
        
        const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${environment}/entries?access_token=${accessToken}&content_type=${contentType}`;

        this.httpService.get<IContentfulResponse>(url)
        .pipe(
            catchError((e) => {
                this.logger.error('Error fetching products from Contentful API');
                this.logger.error(e.message);
                throw 'Error fetching products';
            }),
            map(response => response.data.items.map(item => Content.create(item))),
            mergeMap(async (items) => {
                await Promise.all(items.map((async (item) => {
                    const existingItem = await this.contentRepository.findOneBy({contentId: item.contentId});
                    if (!(existingItem && existingItem.active === false)){
                        await this.contentRepository.upsert(item, ['contentId']);
                    }
                })));
                this.logger.debug('Products synced successfully');
            }),
        ).subscribe();
    }

    public async getAllProducts(query: ProductQuery, pagination: PaginationQuery): Promise<Content[]> {
        return await this.contentRepository.createQueryBuilder('content')
            .where('content.active = :active', {active: true})
            .andWhere(query.sku ? 'UPPER(content.sku) = UPPER(:sku)' : '1=1', { sku: query.sku })
            .andWhere(query.name ? 'UPPER(content.name) LIKE UPPER(:name)' : '1=1', { name: `%${query.name ?? ''}%` })
            .andWhere(query.brand ? 'UPPER(content.brand) LIKE UPPER(:brand)' : '1=1', { brand: `%${query.brand ?? ''}%` })
            .andWhere(query.model ? 'UPPER(content.model) LIKE UPPER(:model)' : '1=1', { model: `%${query.model ?? ''}%` })
            .andWhere(query.category ? 'UPPER(content.category) LIKE UPPER(:category)' : '1=1', { category: `%${query.category ?? ''}%` })
            .andWhere(query.color ? 'UPPER(content.color) LIKE UPPER(:color)' : '1=1', { color: `%${query.color ?? ''}%` })
            .andWhere(query.currency ? 'UPPER(content.currency) LIKE UPPER(:currency)' : '1=1', { currency: `%${query.currency ?? ''}%`})
            .andWhere(query.minPrice ? 'content.price >= :minPrice' : '1=1', { minPrice: query.minPrice })
            .andWhere(query.maxPrice ? 'content.price <= :maxPrice' : '1=1', { maxPrice: query.maxPrice })
            .andWhere(query.minStock ? 'content.stock >= :minStock' : '1=1', { minStock: query.minStock })
            .andWhere(query.maxStock ? 'content.stock <= :maxStock' : '1=1', { maxStock: query.maxStock })
            .skip(pagination.page)
            .take(pagination.limit)
            .getMany();
    }

    public async deleteProduct(id: number) {
        const product = await this.contentRepository.findOneBy({id});
        if (!product) throw new BadRequestException(`Product with id ${id} does not exist`);
        this.contentRepository.update({id}, {active: false});
    }
}
