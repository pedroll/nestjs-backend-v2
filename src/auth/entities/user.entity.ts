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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 255,
    unique: true,
  })
  email: string;

  @Column('varchar', {
    length: 255,
    select: false, // excluimos el campo de la respuesta
  })
  password: string;

  @Column('varchar', {
    length: 255,
  })
  fullName: string;

  @Column('bool', {
    default: true,
    select: false,
  })
  isActive: boolean;

  @Column('text', {
    array: true,
    default: ['user'],
  })
  role: string[];

  @Column('timestamp', {
    nullable: true,
    select: false,
  })
  createdAt: Date;

  @Column('timestamp', {
    nullable: true,
    select: false,
  })
  updatedAt: Date;

  // product
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
