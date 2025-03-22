import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { User } from '../auth/entities/user.entity';
import { CreateUserDto } from '../auth/dto';

@Injectable()
export class SeedService {
  constructor(
    private readonly configService: ConfigService,
    private readonly productsService: ProductsService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async runSeed(): Promise<any> {
    await this.deleteTables();

    const adminUser = await this.insertNewUsers();
    await this.insertNewProducts(adminUser);

    return { message: 'Seed executed' };
  }

  private async deleteTables() {
    // first delete all products
    await this.productsService.removeAllProducts();
    // then delete all tables
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
    return { message: 'Tables deleted' };
  }

  private async insertNewUsers() {
    const seedUsers: CreateUserDto[] = initialData.users;
    const users: User[] = [];

    try {
      const passwordPattern: string =
        this.configService.get<string>('passwordPattern')!;
      const passwordRegex = new RegExp(passwordPattern.slice(1, -1));

      seedUsers.forEach((seedUser: CreateUserDto) => {
        if (!passwordRegex.test(seedUser.password)) {
          console.error({
            passwordRegex,
            passwordPattern,
            password: seedUser.password,
          });
          throw new Error('Password does not meet the required pattern');
        }
        seedUser.password = bcrypt.hashSync(seedUser.password, 10);
        const user = this.userRepository.create(seedUser as unknown as User);
        users.push(user);
      });

      const dbUsers = await this.userRepository.save(users);
      return dbUsers[0];
    } catch (error) {
      console.error('Error inserting new users:', error);
      throw new Error('Failed to insert new users');
    }
  }

  private async insertNewProducts(user: User) {
    await this.productsService.removeAllProducts();

    const products = initialData.products;
    const insertPromises: any[] = [];

    products.forEach((product) => {
      insertPromises.push(this.productsService.create(product, user));
    });

    await Promise.all(insertPromises);

    return { message: 'Products inserted' };
  }
}
