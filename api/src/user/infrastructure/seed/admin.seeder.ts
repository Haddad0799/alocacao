import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { Role } from '../../domain/valueobject/role';
import { PASSWORD_HASHER } from '../../domain/port/password-hasher.port';
import type { PasswordHasherPort } from '../../domain/port/password-hasher.port';
import { Inject } from '@nestjs/common';

@Injectable()
export class AdminSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminSeeder.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
    @Inject(PASSWORD_HASHER)
    private readonly hasher: PasswordHasherPort,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const email = this.config.getOrThrow<string>('ADMIN_EMAIL');
    const password = this.config.getOrThrow<string>('ADMIN_PASSWORD');

    const exists = await this.repo.findOne({ where: { email } });
    if (exists) {
      this.logger.log('Admin already exists, skipping seed');
      return;
    }

    const admin = this.repo.create({
      name: 'Administrator',
      email,
      passwordHash: await this.hasher.hash(password),
      role: Role.ADMIN,
    });

    await this.repo.save(admin);
    this.logger.log(`Admin seeded: ${email}`);
  }
}