import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from '../../auth/entities/user.entity';

@Entity({ name: 'products' })
export class Product {
  // Usamos PSQL, por lo tanto, los tipos de columna deben ser acordes
  @ApiProperty({
    example: 'uuid',
    description: 'The unique identifier of the product',
    uniqueItems: true,
    required: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Product Name',
    description: 'The name of the product',
    required: true,
  })
  @Column('text', {
    unique: true,
  })
  name: string;

  @ApiProperty({
    example: 100.0,
    description: 'The price of the product',
    default: 0,
    required: false,
  })
  @Column('float', {
    default: 0,
  })
  price: number;

  @ApiProperty({
    example: 'Product description',
    description: 'The description of the product',
    nullable: true,
    default: null,
    required: false,
  })
  @Column('text', {
    nullable: true,
  })
  description: string;

  @ApiProperty({
    example: 'product-slug',
    description: 'The slug of the product',
    uniqueItems: true,
    required: false,
  })
  @Column('text', {
    unique: true,
  })
  slug: string;

  @ApiProperty({
    example: 10,
    description: 'The stock of the product',
    default: 0,
    required: false,
  })
  @Column('float', {
    default: 0,
  })
  stock: number;

  @ApiProperty({
    example: ['S', 'M', 'L'],
    description: 'The available sizes of the product',
    nullable: true,
    isArray: true,
    default: [],
    required: false,
  })
  @Column('text', {
    array: true,
    nullable: true,
  })
  sizes: string[];

  @ApiProperty({
    example: 'unisex',
    description: 'The gender category of the product',
    nullable: true,
    default: null,
    required: false,
  })
  @Column('text', {
    nullable: true,
  })
  gender?: string;

  @ApiProperty({
    example: ['tag1', 'tag2'],
    description: 'The tags associated with the product',
    isArray: true,
    default: [],
    required: false,
  })
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  @ApiProperty({
    type: [ProductImage],
    description: 'The images of the product',
    isArray: true,
    default: [],
    required: false,
  })
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images: ProductImage[];

  // @ApiProperty({
  //   // type: User,
  //   // description: 'The user who created the product',
  // })
  @ManyToOne(
    () => User, // entidad relación
    (user) => user.product, //campo relación destino
    {
      eager: true, // cargamos la relación al hacer find
    },
  )
  user: User;

  @BeforeInsert()
  @BeforeUpdate()
  checkSlugInsert(): void {
    // sanitize the slug if no slug take name
    if (!this.slug) this.slug = this.name;
    this.slug = this.slug
      .trim()
      .toLowerCase()
      .replaceAll(' ', '-')
      .replaceAll("'", '');
  }

  // @BeforeUpdate()
  // checkSlugUpdate(): void {
  //   // sanitize the slug if no slug take name
  //   if (!this.slug) this.slug = this.name;
  //   this.slug = this.slug
  //     .trim()
  //     .toLowerCase()
  //     .replaceAll(' ', '-')
  //     .replaceAll("'", '');
  // }
}
