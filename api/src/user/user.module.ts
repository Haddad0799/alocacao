import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserUseCase } from './application/usecase/create-user.usecase';
import { USER_REPOSITORY } from './domain/port/user.repository.port';
import { TypeOrmUserRepository } from './infrastructure/persistence/repository/typeorm-user.repository';
import { UserEntity } from './infrastructure/entities/user.entity';
import { SecurityModule } from '../security/security.module';
import { AdminSeeder } from './infrastructure/seed/admin.seeder';
import { APP_FILTER } from '@nestjs/core';
import { UserExceptionFilter } from './presentation/filter/user-exception.filter';
import { UserController } from './presentation/rest/user.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    SecurityModule,
  ],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    { provide: USER_REPOSITORY, useClass: TypeOrmUserRepository },
    AdminSeeder,
    { provide: APP_FILTER, useClass: UserExceptionFilter },
  ],
})
export class UserModule {}