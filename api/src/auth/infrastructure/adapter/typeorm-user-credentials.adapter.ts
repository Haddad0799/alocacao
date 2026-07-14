import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../user/infrastructure/entities/user.entity';
import type {
  UserCredentials,
  UserCredentialsPort,
} from '../../domain/port/user-credentials.port';

@Injectable()
export class TypeormUserCredentialsAdapter implements UserCredentialsPort {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserCredentials | null> {
    const row = await this.repo.findOne({
      where: { email },
      select: ['id', 'email', 'passwordHash', 'role'],
    });
    return row ? this.toCredentials(row) : null;
  }

  async findById(id: string): Promise<UserCredentials | null> {
    const row = await this.repo.findOne({
      where: { id },
      select: ['id', 'email', 'passwordHash', 'role'],
    });
    return row ? this.toCredentials(row) : null;
  }

  private toCredentials(row: UserEntity): UserCredentials {
    return {
      id: row.id,
      email: row.email,
      passwordHash: row.passwordHash,
      role: row.role,
    };
  }
}