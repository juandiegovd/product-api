import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from '../src/entities/content.entity';
import { ReportModule } from '../src/report/report.module';
import { ReportService } from '../src/report/report.service';
import { Repository } from 'typeorm';
import { AuthModule } from '../src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import contentfulApiConfig from '../src/config/contentful-api.config';
import { App } from 'supertest/types';

describe('Report Controller (e2e)', () => {
  let app: INestApplication<App>;
  let repository: Repository<Content>;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [contentfulApiConfig],
        }),
        ReportModule,
        AuthModule,
        TypeOrmModule.forRootAsync({
          useFactory: () => {
            return {
              type: 'sqlite',
              database: ':memory:',
              entities: [Content],
              synchronize: true,
            };
          },
        }),
        TypeOrmModule.forFeature([Content]),
      ],
      providers: [ReportService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();

    repository = moduleFixture.get('ContentRepository');
    await repository.save([
      {
        contentId: 'QWERTY',
        name: 'Jeep Grand Cherokee 2003',
        brand: 'Jeep',
        category: 'Vehicle',
        active: true,
        price: 100,
        stock: 50,
      },
      {
        contentId: 'ASDEF',
        name: 'Hyudan Tucson 2005',
        brand: 'Hyundai',
        category: 'Vehicle',
        active: true,
        price: 40,
        stock: 100,
      },
      {
        contentId: 'DGDGDH',
        name: 'Ford Territory 2021',
        brand: 'Ford',
        category: 'Vehicle',
        active: true,
        price: 150,
        stock: 80,
      },
      {
        contentId: 'XCXVB',
        name: 'Mazda CX-5 2014',
        brand: 'Mazda',
        category: 'Vehicle',
        active: false,
        price: 60,
        stock: 10,
      },
    ]);

    const authResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin' })
      .expect(201);
    const body = authResponse.body as { accessToken: string };
    token = body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return the percentage of inactive products', async () => {
    const response = await request(app.getHttpServer())
      .get('/report/inactive-percentage')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.text).toEqual('25');
  });

  it('should return the percentage of active products', async () => {
    const response = await request(app.getHttpServer())
      .get('/report/active-percentage')
      .set('Authorization', `Bearer ${token}`)
      .query({ minDate: '2025-01-01', maxDate: '2026-01-01' })
      .expect(200);
    expect(response.text).toEqual('75');
  });

  it('should return bad request for not sending dates', async () => {
    return await request(app.getHttpServer())
      .get('/report/active-percentage')
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });

  it('should return the average of all active products', async () => {
    const response = await request(app.getHttpServer())
      .get('/report/average-price')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.text).toEqual('96.67');
  });

  it('should return unauthorize for not sending token', async () => {
    return await request(app.getHttpServer())
      .get('/report/average-price')
      .expect(401);
  });
});
