import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('users')
export class User {
  @ApiProperty({
    example: 'uuid',
    description: 'The unique identifier of the user',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
    uniqueItems: true,
  })
  @Column('varchar', {
    length: 255,
    unique: true,
  })
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'The password of the user',
    minLength: 6,
    maxLength: 50,
  })
  @Column('varchar', {
    length: 255,
    select: false, // exclude the field from the response
  })
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the user',
    minLength: 3,
    maxLength: 50,
  })
  @Column('varchar', {
    length: 255,
  })
  fullName: string;

  @ApiProperty({
    example: true,
    description: 'Indicates whether the user is active',
    default: true,
  })
  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @ApiProperty({
    example: ['user'],
    description: 'The roles assigned to the user',
    isArray: true,
    default: ['user'],
  })
  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'The date when the user was created',
    nullable: true,
    required: false,
  })
  @Column('timestamp', {
    nullable: true,
    select: false,
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'The date when the user was last updated',
    nullable: true,
    required: false,
  })
  @Column('timestamp', {
    nullable: true,
    select: false,
  })
  updatedAt: Date;

  // @ApiProperty({
  //   type: [Product],
  //   description: 'The products created by the user',
  //   isArray: true,
  // })
  @OneToMany(
    () => Product, // entidad relacion
    (product) => product.user, //campo relacion destino
  )
  product: Product;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.updatedAt = new Date();
    this.email = this.email.toLowerCase().trim();
  }
}
