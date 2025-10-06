import {  INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Content } from "../src/entities/content.entity";
import request from 'supertest';
import { ProductService } from "../src/product/product.service";
import { Repository } from "typeorm";
import { ConfigModule } from "@nestjs/config";
import contentfulApiConfig from "../src/config/contentful-api.config";
import { ProductModule } from "../src/product/product.module";
import { GlobalModule } from "../src/http/http-interceptor.module";

describe('ProductController (e2e)', () =>{
    let app: INestApplication;
    let repository: Repository<Content>
    
    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ 
                    isGlobal: true,
                    load: [contentfulApiConfig],
                }),
                GlobalModule,
                ProductModule,
                TypeOrmModule.forRootAsync({
                   useFactory: () => {
                    return {
                        type: 'sqlite',
                        database: ':memory:',
                        entities: [Content],
                        synchronize: true,
                    }
                   }
                }),
                TypeOrmModule.forFeature([Content])
            ],
            providers: [ProductService]
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
        repository = moduleFixture.get('ContentRepository');

        await repository.save(
            [
                { contentId: 'QWERTY', name: 'Jeep Grand Cherokee 2003', brand: 'Jeep', category: 'Vehicle', active: true, price: 100, stock: 50 },
                { contentId: 'ASDEF', name: 'Hyudan Tucson 2005', brand: 'Hyundai', category: 'Vehicle', active: true, price: 40, stock: 100 }, 
                { contentId: 'DGDGDH', name: 'Ford Territory 2021', brand: 'Ford', category: 'Vehicle', active: true, price: 150, stock: 80 }, 
                { contentId: 'XCXVB', name: 'Mazda CX-5 2014', brand: 'Mazda', category: 'Vehicle', active: false, price: 60, stock: 10 },
            ]
        );
    });

    afterAll(async () => {
        await app.close();
    });

    it('should return products that match filters', async () => {
        const response = await request(app.getHttpServer())
                        .get('/product')
                        .query({category: 'Vehicle', minPrice: 100, maxPrice: 150, page: 0, limit: 5})
                        .expect(200);
        expect(response.body).toHaveLength(2);
        expect(response.body[0].brand).toEqual('Jeep');
        expect(response.body[1].brand).toEqual('Ford');
    });

    it('should delete product', async () => {
        const response = await request(app.getHttpServer())
                        .get('/product')
                        .query({category: 'Vehicle', minPrice: 100, maxPrice: 150, page: 0, limit: 5})
                        .expect(200);
        expect(response.body).toHaveLength(2);
        expect(response.body[0].brand).toEqual('Jeep');
        expect(response.body[1].brand).toEqual('Ford');

        const resultId = await repository.query("SELECT id FROM content where brand = 'Jeep'");
        await request(app.getHttpServer())
              .delete(`/product/${resultId[0].id}`)
              .expect(200);

        const responseAfterDelete = await request(app.getHttpServer())
                        .get('/product')
                        .query({category: 'Vehicle', minPrice: 100, maxPrice: 150, page: 0, limit: 5})
                        .expect(200);
        expect(responseAfterDelete.body).toHaveLength(1);
        expect(responseAfterDelete.body[0].brand).toEqual('Ford');
    });
})