import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../domain/entity/user';
import type { UserRepositoryPort } from '../../../domain/port/user.repository.port';
import { UserEntity } from '../../entities/user.entity';
import { Email } from '../../../domain/valueobject/email';

@Injectable()
export class TypeOrmUserRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}


  async findUserByEmail(email: string): Promise<User | null> {
    const found = await this.repo.findOne({ where: { email } });
    return found ? this.toDomain(found) : null;
  }

  async saveUser(user: User): Promise<User> {
    const saved = await this.repo.save(this.toOrm(user));
    return this.toDomain(saved);
  }

  private toDomain(orm: UserEntity): User {
    const user = User.restore(
  orm.id,
  orm.name,
  Email.of(orm.email),
  orm.passwordHash,
  orm.role,
);
    return user;
  }

  private toOrm(user: User): UserEntity {
  const entity = new UserEntity();
  if (user.id) {
    entity.id = user.id;
  }
  entity.name = user.name;
  entity.email = user.email.value;
  entity.passwordHash = user.passwordHash;
  entity.role = user.role;
  return entity;
}

   findUserById(id: string): Promise<User | null> {
        throw new Error('Method not implemented.');
    }
    updateUser(user: User): Promise<User> {
        throw new Error('Method not implemented.');
    }
    deleteUser(id: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
}