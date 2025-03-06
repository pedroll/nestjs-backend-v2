import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  // Usamos PostgreSQL, por lo tanto, los tipos de columna deben ser acordes
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  name: string;

  @Column('float', {
    default: 0,
  })
  price: number;

  // despription es opcional
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  //eslug es opcional
  @Column('text', {
    unique: true,
  })
  slug: string;

  // stock es opcional
  @Column('float', {
    default: 0,
  })
  stock: number;

  //sizes []
  @Column('text', {
    array: true,
    nullable: true,
  })
  sizes: string[];

  // gender es opcional
  @Column('text', {
    nullable: true,
  })
  gender: string;
}
