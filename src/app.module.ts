import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import contentfulApiConfig from './config/contentful-api.config';
import { GlobalModule } from './http/http-interceptor.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import dbConfig from './config/db.config';
import { ScheduleModule } from '@nestjs/schedule';
import { ReportModule } from './report/report.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      load: [contentfulApiConfig, dbConfig],
    }),
    GlobalModule, 
    ProductModule,
    TypeOrmModule.forRootAsync({
      useFactory: dbConfig,
    }),
    ScheduleModule.forRoot(),
    ReportModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
