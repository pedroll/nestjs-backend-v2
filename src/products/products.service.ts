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
import { isUUID } from 'class-validator';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ProductsService {
  private paginationLimit: number | undefined;
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly configService: ConfigService,
  ) {
    this.paginationLimit = this.configService.get<number>('paginationLimit');
  }

  /**
   * Creates a new product in the database.
   *
   * @param {CreateProductDto} createProductDto - The data transfer object containing the details of the product to be created.
   * @returns {Promise<Product | void>} The newly created product.
   * @throws {BadRequestException} If a product with the same name already exists.
   * @throws {InternalServerErrorException} If an error occurs during the creation process.
   */
  async create(createProductDto: CreateProductDto): Promise<Product | void> {
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

  /**
   * Retrieves a paginated list of Product from the database.
   *
   * @returns A promise that resolves to an array of Product.*/
  async findAll(paginationDto: PaginationDto) {
    // default values
    const { limit = this.paginationLimit, offset = 0 } = paginationDto;
    return await this.productRepository.find({
      skip: offset,
      take: limit,
      order: {
        name: 'ASC',
      },
      select: ['id', 'name', 'price', 'description'],
    });
  }

  /**
   * Retrieves a Product by its number, MongoDB ID, or name.
   *
   * @param term - The term to search for (number, MongoDB ID, or name).
   * @returns A promise that resolves to the found Product.
   * @throws NotFoundException if no Product is found.
   */
  async findOne(term: string) {
    let product: Product | null = null;
    // Search by Product name
    if (isUUID(term)) {
      this.logger.log(`Product searching by ID: ${term}`);
      product = await this.productRepository.findOne({ where: { id: term } });
    } else {
      this.logger.log(`Product searching by uuid, slug, name : ${term}`);
      // product = await this.productRepository.findOne({
      //   where: [
      //     { name: term.trim() },
      //     { slug: term.toLocaleLowerCase().trim() },
      //   ],
      // });
      // alternativa con queryBuilder
      const queriBuilder = this.productRepository.createQueryBuilder();
      product = await queriBuilder
        .where('LOWER(name) = LOWER(:name) or slug = :slug', {
          name: term.trim(),
          slug: term.trim().toLocaleLowerCase(),
        })
        .getOne();
    }
    // Throw an exception if no Product is found
    if (!product) {
      throw new NotFoundException(`Product '${term}' not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    // prepara update
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
    });
    // si no existe el producto
    if (!product)
      throw new NotFoundException(`Product with id '${id}' not found`);

    // actualiza el producto
    try {
      return await this.productRepository.save(product);
    } catch (error) {
      this.handleDbException(error);
    }
  }

  /**
   * Removes a Product from the database.
   *
   * @param id - The MongoDB ID of the Product to remove.
   * @returns A promise that resolves when the Product is removed.
   * @throws NotFoundException if no Product is found with the given ID.
   */
  async remove(id: string) {
    // const product = await this.findOne(id);
    // await product.deleteOne();
    // return `This action removes a #${id} product`;

    // const result = await this.productModel.findByIdAndDelete(id);

    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with id '${id}' not found`);
    }
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
