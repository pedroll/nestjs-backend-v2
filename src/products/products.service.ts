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
  DataSource,
  EntityNotFoundError,
  QueryFailedError,
  Repository,
} from 'typeorm';
import { isUUID } from 'class-validator';

import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ProductImage } from './entities/product-image.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ProductsService {
  private paginationLimit: number | undefined;
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {
    this.paginationLimit = this.configService.get<number>(
      'postgres.paginationLimit',
    );
  }

  /**
   * Creates a new product in the database.
   *
   * @param {CreateProductDto} createProductDto - The data transfer object containing the details of the product to be created.
   * @returns {Promise<Product | void>} The newly created product.
   * @throws {BadRequestException} If a product with the same name already exists.
   * @throws {InternalServerErrorException} If an error occurs during the creation process.
   */
  async create(createProductDto: CreateProductDto, user: User) {
    try {
      //transformar string[] a productImage[]
      const { images = [], ...productDetails } = createProductDto;
      // Create a new Product instance
      const newProduct = this.productRepository.create({
        ...productDetails,
        images: images.map((url) =>
          this.productImageRepository.create({ url }),
        ),
        user,
      });
      // Save the new Product to the database
      await this.productRepository.save(newProduct);

      //por decision retornamos la image como string[]
      return { ...newProduct, images: images };
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
    const {
      limit = this.paginationLimit,
      offset = 0,
      gender = '',
    } = paginationDto;
    const products = await this.productRepository.find({
      skip: offset,
      take: limit,
      order: {
        id: 'ASC',
      },
      relations: ['images'],
      where: gender ? [{ gender }, { gender: 'unisex' }] : {},
    });

    const totalProducts = await this.productRepository.count({
      where: gender ? [{ gender }, { gender: 'unisex' }] : {},
    });

    return {
      count: totalProducts,
      pages: Math.ceil(totalProducts / limit!),
      products: products.map(({ images, ...product }) => ({
        ...product,
        images: images.map((image) => image.url),
      })),
    };
  }

  /**
   * Retrieves a Product by its number, MongoDB ID, or name.
   *
   * @param term - The term to search for (number, MongoDB ID, or name).
   * @returns A promise that resolves to the found Product.
   * @throws NotFoundException if no Product is found.
   */
  async findOne(term: string) {
    let product: Product | null;
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
      const queriBuilder = this.productRepository.createQueryBuilder('prod'); // creamos alias
      product = await queriBuilder
        .where('LOWER(name) = LOWER(:name) or slug = :slug', {
          name: term.trim(),
          slug: term.trim().toLocaleLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'images')
        .getOne();
    }
    // Throw an exception if no Product is found
    if (!product) {
      throw new NotFoundException(`Product '${term}' not found`);
    }

    return product;
  }

  /**
   * Retrieves a plain representation of a Product by its term (ID, slug, or name).
   *
   * This method first calls the `findOne` method to retrieve the Product entity,
   * then transforms the `images` property from an array of `ProductImage` entities
   * to an array of image URLs.
   *
   * @param {string} term - The term to search for (ID, slug, or name).
   * @returns {Promise<{ images: string[] } & Omit<Product, 'images'>>} A promise that resolves to the found Product with images as URLs.
   * @throws {NotFoundException} If no Product is found.
   */
  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map((image) => image.url),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    const { images = [], ...productDetails } = updateProductDto;

    // prepara update
    const product = await this.productRepository.preload({
      id,
      ...productDetails,
    });
    // si no existe el producto
    if (!product)
      throw new NotFoundException(`Product with id '${id}' not found`);

    // create query runner
    // const queryRunner =
    //   this.productRepository.manager.connection.createQueryRunner();
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // si vienen imagenes delete toda  product images
      if (images.length > 0) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
      }
      // relaciona el usuario
      product.user = user;
      // actualiza el producto
      await queryRunner.manager.save(Product, {
        ...product,
        images: images.map((url) =>
          this.productImageRepository.create({ url }),
        ),
      });
      // commit transaction
      await queryRunner.commitTransaction();
    } catch (error) {
      // Rollback transaction if an error occurs
      await queryRunner.rollbackTransaction();
      this.handleDbException(error);
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
    return { ...product, images };
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

  async removeAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');
    try {
      await query.delete().where({}).execute();
    } catch (error) {
      this.handleDbException(error);
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
    // only for sample test
    if (error.error === '23505') throw new BadRequestException(error.message);

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
    console.log(error);
    this.logger.error(error);
    throw new InternalServerErrorException(
      `Failed to create Product: consult logs`,
    );
  }
}
