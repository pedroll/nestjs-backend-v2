import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}
  runSeed(): any {
    this.insertNewProducts();
    return { message: 'Seed executed' };
  }

  private async insertNewProducts() {
    await this.productsService.removeAllProducts();
    // insert products

    // Create products
  }
}
