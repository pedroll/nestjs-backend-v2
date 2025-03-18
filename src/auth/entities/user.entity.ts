import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

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
}
