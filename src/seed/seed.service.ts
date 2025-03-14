import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}

  async runSeed(): Promise<any> {
    await this.insertNewProducts();
    return { message: 'Seed executed' };
  }

  private async insertNewProducts() {
    await this.productsService.removeAllProducts();

    const products = initialData.products;
    const inserPromises: any[] = [];

    products.forEach((product) => {
      inserPromises.push(this.productsService.create(product));
    });

    await Promise.all(inserPromises);

    return { message: 'Products inserted' };
  }
}
