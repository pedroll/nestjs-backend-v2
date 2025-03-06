import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import {
  CannotCreateEntityIdMapError,
  EntityNotFoundError,
  QueryFailedError,
  Repository,
} from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private paginationLimit;
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly configService: ConfigService,
  ) {
    this.paginationLimit = this.configService.get<number>('paginationLimit');
  }

  async create(createProductDto: CreateProductDto) {
    try {
      // Create a new Product instance
      const newProduct = this.productRepository.create(createProductDto);
      // Save the new Product to the database
      await this.productRepository.save(newProduct);

      return newProduct;
    } catch (error) {
      // Handle any exceptions that occur during the creation process
      this.handleDbException(error);
    }
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  /**
   * Handles exceptions that occur during database operations.
   *
   * @param error - The error object.
   * @throws BadRequestException if a Product with the same name or "no" already exists.
   * @throws InternalServerErrorException for other errors.
   */
  private handleDbException(error) {
    if (error instanceof QueryFailedError) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.driverError.code === '23505') {
        throw new BadRequestException(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          `Product already exists ${JSON.stringify(error.driverError.detail)}`,
        );
      }
    } else if (error instanceof EntityNotFoundError) {
      throw new NotFoundException(`Product not found`);
    } else if (error instanceof CannotCreateEntityIdMapError) {
      throw new InternalServerErrorException(`Failed to create entity ID map`);
    }

    this.logger.error(error);
    throw new InternalServerErrorException(
      `Failed to create Product: consult logs`,
    );
  }
}
