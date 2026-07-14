import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../../domain/valueobject/role';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ name: 'password_hash', select: false })
  passwordHash!: string;

  @Column({ type: 'enum', enum: Role })
  role!: Role;
}