import { ProductsService } from './products.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { ConfigService } from '@nestjs/config';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto';
import { User } from '../auth/entities/user.entity';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('AuthService', () => {
  let service: ProductsService;
  let productsRepository: Repository<Product>;
  let productImageRepository: Repository<ProductImage>;

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
    productsRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    productImageRepository = module.get<Repository<ProductImage>>(
      getRepositoryToken(ProductImage),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should crete a product', async () => {
    const dto = {
      name: 'Test Product',
      price: 100,
      images: ['path/to/image1.jpg'],
    } as CreateProductDto;
    const user = {
      id: '1',
    } as User;

    const { images, ...createDto } = dto;
    const newProduct = {
      id: '1',
      ...createDto,
      user,
    } as unknown as Product;

    jest.spyOn(productsRepository, 'create').mockReturnValue(newProduct);
    jest.spyOn(productsRepository, 'save').mockResolvedValue(newProduct);
    jest
      .spyOn(productImageRepository, 'create')
      .mockImplementation((imageData) => imageData as unknown as ProductImage);

    const result = await service.create(dto, user);

    expect(result).toEqual({
      id: '1',
      name: 'Test Product',
      price: 100,
      user: { id: '1' },
      images: ['path/to/image1.jpg'],
    });
  });

  it.todo('All others errors');

  it('should throw if create fail', async () => {
    const dto = {} as CreateProductDto;
    const user = {} as User;

    jest.spyOn(productsRepository, 'save').mockRejectedValue({
      error: '23505',
      message: 'XXXFailed to create Product: consult logs',
    });
    const result = service.create(dto, user);

    await expect(result).rejects.toThrow(BadRequestException);
    await expect(result).rejects.toThrow(
      'XXXFailed to create Product: consult logs',
    );
  });
});
