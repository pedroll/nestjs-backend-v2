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
  })
  password: string;

  @Column('varchar', {
    length: 255,
  })
  fullName: string;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @Column('text', {
    array: true,
    default: ['user'],
  })
  role: string[];

  @Column('text', {
    nullable: true,
  })
  createdAt: Date;

  @Column('timestamp', {
    nullable: true,
  })
  updatedAt: Date;
}
