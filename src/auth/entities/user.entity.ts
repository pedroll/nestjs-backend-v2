import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
