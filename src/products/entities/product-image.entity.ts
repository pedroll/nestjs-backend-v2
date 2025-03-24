import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'product_images' })
export class ProductImage {
  // Usamos PostgreSQL, por lo tanto, los tipos de columna deben ser acordes
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the product image',
  })
  @PrimaryGeneratedColumn('increment')
  id: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'The URL of the product image',
  })
  @Column('text')
  url: string;

  @ApiProperty({
    type: () => Product,
    description: 'The product associated with the image',
  })
  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
