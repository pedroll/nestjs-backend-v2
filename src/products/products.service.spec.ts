import { ProductsService } from './products.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { ConfigService } from '@nestjs/config';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto';
import { User } from '../auth/entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PaginationDto } from '../common/dto/pagination.dto';

describe('AuthService', () => {
  let service: ProductsService;
  let productsRepository: Repository<Product>;
  let productImageRepository: Repository<ProductImage>;

  beforeEach(async () => {
    const mockQueryBuilder = {
      where: jest.fn().mockReturnThis(), // valido tenemos alternativa
      // where: jest.fn(() => mockQueryBuilder), // valido pero tenemos alternativa
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockReturnValue({
        id: 'valid-uuid',
        name: 'Test Product',
      }),
    };
    const mockProductRepository = {
      find: jest.fn().mockReturnValue([]),
      findOne: jest.fn().mockReturnValue(null),
      save: jest.fn().mockReturnValue({ id: 1 }),
      count: jest.fn().mockReturnValue(0),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  it('should find all products', async () => {
    const dto = {
      limit: 2,
      offset: 2,
      gender: 'unisex',
    } as PaginationDto;

    const products = [
      {
        id: '1',
        name: 'Test Product 1',
        price: 100,
        gender: 'unisex',
        images: [{ id: '1', url: 'image1.jpg' }],
      },
      {
        id: '2',
        name: 'Test Product 2',
        price: 200,
        gender: 'unisex',
        images: [{ id: '2', url: 'image2.jpg' }],
      },
      {
        id: '3',
        name: 'Test Product 3',
        price: 300,
        gender: 'unisex',
        images: [{ id: '3', url: 'image3.jpg' }],
      },
      {
        id: '4',
        name: 'Test Product 4',
        price: 400,
        gender: 'unisex',
        images: [{ id: '4', url: 'image4.jpg' }],
      },
    ] as unknown as Product[];

    jest.spyOn(productsRepository, 'find').mockResolvedValue(products);
    jest.spyOn(productsRepository, 'count').mockResolvedValue(products.length);

    const result = await service.findAll(dto);

    expect(result).toEqual({
      count: 4,
      pages: 2,
      products: products.map((product) => ({
        ...product,
        images: product.images.map((image) => image.url),
      })),
    });
  });

  describe('findOne tests', () => {
    it('should find product by uuid', async () => {
      const id = '12345678-1234-1234-1234-1234567890ab';
      const product = {
        id: id,
        name: 'Test Product',
      } as Product;

      jest.spyOn(productsRepository, 'findOne').mockResolvedValue(product);
      const result = await service.findOne(id);

      expect(result).toEqual(product);
    });

    it('should fail if uuid not found', async () => {
      const id = '12345678-1234-1234-1234-1234567890ab';

      jest.spyOn(productsRepository, 'findOne').mockResolvedValue(null);

      const result = service.findOne(id);

      await expect(result).rejects.toThrow(NotFoundException);
      await expect(result).rejects.toThrow(`Product '${id}' not found`);
    });

    it('should return product  name or slug', async () => {
      const term = 'Test Product';

      const result = await service.findOne(term);
      expect(result).toEqual({
        id: 'valid-uuid',
        name: 'Test Product',
      });
    });
  });
});
