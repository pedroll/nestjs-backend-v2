import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private paginationLimit;

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly configService: ConfigService,
  ) {
    this.paginationLimit = this.configService.get<number>('paginationLimit');
  }

  async create(createProductDto: CreateProductDto) {
    try {
      // Convert the Product name to lowercase
      //createProductDto.name = createProductDto.name.toLocaleLowerCase();

      // Create a new Pokémon instance
      const newProduct = this.productRepository.create(createProductDto);

      // Save the new Pokémon to the database
      return await this.productRepository.save(newProduct);
    } catch (error) {
      // Handle any exceptions that occur during the creation process
      this.handleException(error);
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
   * @throws BadRequestException if a Pokémon with the same name or "no" already exists.
   * @throws InternalServerErrorException for other errors.
   */
  private handleException(error) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon already exists ${JSON.stringify(error.keyValue)}`,
      );
    }

    console.error(error);
    throw new InternalServerErrorException(
      `Failed to create Product: consult logs`,
    );
  }
}
