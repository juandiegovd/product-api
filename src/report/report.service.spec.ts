import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReportService } from './report.service';
import { Content } from '../entities/content.entity';

describe('ReportService', () => {
  let service: ReportService;
  let contentRepository: Repository<Content>;

  const mockRepository = {
    count: jest.fn(),
    countBy: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        { provide: getRepositoryToken(Content), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
    contentRepository = module.get<Repository<Content>>(
      getRepositoryToken(Content),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return correct inactive percentage', async () => {
    contentRepository.count = jest.fn().mockReturnValue(10);
    contentRepository.countBy = jest.fn().mockReturnValue(4);
    const response = await service.getInactiveProductsPercentage();
    expect(response).toEqual(40);
  });

  it('should return correct active percentage', async () => {
    const mockQueryBuilder: any = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getCount: jest.fn().mockResolvedValue(4),
    };

    contentRepository.count = jest.fn().mockReturnValue(10);
    contentRepository.createQueryBuilder = jest
      .fn()
      .mockReturnValue(mockQueryBuilder);
    const response = await service.getActiveProductsPercentage(
      new Date('2025-01-01'),
      new Date('2026-01-01'),
    );
    expect(response).toEqual(40);
  });

  it('should return correct average price', async () => {
    const mockQueryBuilder: any = {
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue({ avg: 43.5231245 }),
    };

    contentRepository.createQueryBuilder = jest
      .fn()
      .mockReturnValue(mockQueryBuilder);
    const response = await service.getAveragePriceOfActiveProducts();
    expect(response).toEqual(43.52);
  });
});
