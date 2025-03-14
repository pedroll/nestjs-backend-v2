import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductImage {
  // Usamos PostgreSQL, por lo tanto, los tipos de columna deben ser acordes
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column('text')
  url: string;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
