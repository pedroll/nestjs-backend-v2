import { ProductsService } from './products.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

describe('AuthService', () => {
  let service: ProductsService;
  // let productsRepository: Repository<Product>;
  // let productImageRepository: Repository<ProductImage>;
  // let configService: ConfigService;
  beforeEach(async () => {
    const mockProductRepository = {
      find: jest.fn().mockReturnValue([]),
      findOne: jest.fn().mockReturnValue(null),
      save: jest.fn().mockReturnValue({ id: 1 }),
      count: jest.fn().mockReturnValue(0),
      createQueryBuilder: jest.fn().mockReturnValue({}),
      delete: jest.fn().mockReturnValue({}),
      create: jest.fn().mockReturnValue({ id: 1 }),
    };

    const mockProductImageRepository = {
      create: jest.fn().mockReturnValue({ id: 1 }),
    };

    const mockConfigService = {
      get: jest.fn().mockReturnValue('test'),
    };

    const mockDataSource = {
      createQueryRunner: jest.fn().mockReturnValue({
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          delete: jest.fn(),
          save: jest.fn(),
        },
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: getRepositoryToken(ProductImage),
          useValue: mockProductImageRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    // productsRepository = module.get<Repository<Product>>(Repository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
