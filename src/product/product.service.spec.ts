import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';
import { Content } from '../entities/content.entity';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { of } from 'rxjs';
import { AxiosHeaders, AxiosResponse } from 'axios';
import { BadRequestException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let httpService: HttpService;
  let contentRepository: Repository<Content>;

  const mockConfig = {
    get: jest.fn((key)=>{
      switch(key){
        case 'CONTENTFUL_SPACE_ID': return 'contentful_space_id';
        case 'CONTENTFUL_ACCESS_TOKEN': return 'contentful_access_token';
        case 'CONTENTFUL_ENVIRONMENT': return 'contentful_environment';
        case 'CONTENFTUL_CONTENT_TYPE': return 'contentful_content_type';
      }
    })
  }

  const mockRepository = {
    findOneBy: jest.fn(),
    upsert: jest.fn(),
    update: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService, 
        {provide: ConfigService, useValue: mockConfig}, 
        {provide: HttpService, useValue: {get: jest.fn()}},
        {provide: getRepositoryToken(Content), useValue: mockRepository}],
    }).compile();

    service = module.get<ProductService>(ProductService);
    httpService = module.get<HttpService>(HttpService);
    contentRepository = module.get<Repository<Content>>(getRepositoryToken(Content));
  });

  it('should fetch and upsert products', async () => {
    const fakeContentData = { sys: { id: "ASDFCBBN" }, fields: {name: 'Test 1'} }
    const fakeContentResponse: AxiosResponse = {
      data: {items: [fakeContentData]},
      status: 200,
      statusText: "",
      headers: {},
      config: { headers: new AxiosHeaders()}
    };
    jest.spyOn(httpService, 'get').mockReturnValue(of(fakeContentResponse));
    contentRepository.findOneBy = jest.fn().mockResolvedValue(null);
    contentRepository.upsert = jest.fn();

    await service.syncProducts();
    expect(httpService.get).toHaveBeenCalled();
    expect(contentRepository.upsert).toHaveBeenCalled();
  });

  it('should fetch and not upsert inactive products', async () => {
    const fakeContentData = { sys: { id: "ASDFCBBN" }, fields: {name: 'Test 1'} }
    const fakeContentResponse: AxiosResponse = {
      data: {items: [fakeContentData]},
      status: 200,
      statusText: "",
      headers: {},
      config: { headers: new AxiosHeaders()}
    };
    jest.spyOn(httpService, 'get').mockReturnValue(of(fakeContentResponse));
    contentRepository.findOneBy = jest.fn().mockResolvedValue({id: 1, contentId: "ASDFCBBN", name: "Test 0", active: false});
    contentRepository.upsert = jest.fn();

    await service.syncProducts();
    expect(httpService.get).toHaveBeenCalled();
    expect(contentRepository.upsert).toHaveBeenCalledTimes(0);
  });

  it('should delete existing product', async () => {
    contentRepository.findOneBy = jest.fn().mockReturnValue({id: 1, contentId: 'ASDFGS', name: 'Test 1', active: true});
    await service.deleteProduct(1);
    expect(contentRepository.update).toHaveBeenCalled();
  });

  it('should throw error when id does not exist for deletion', async () => {
    contentRepository.findOneBy = jest.fn();
    expect(service.deleteProduct(129483)).rejects.toThrow(BadRequestException);
  });
});
