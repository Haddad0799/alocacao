import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUserController } from './presentation/rest/admin-user.controller';
import { CreateUserUseCase } from './application/usecase/create-user.usecase';
import { USER_REPOSITORY } from './domain/port/user.repository.port';
import { TypeOrmUserRepository } from './infrastructure/persistence/repository/typeorm-user.repository';
import { UserEntity } from './infrastructure/entities/user.entity';
import { SecurityModule } from '../security/security.module';
import { DeveloperController } from './presentation/rest/developer.controller';
import { AdminSeeder } from './infrastructure/seed/admin.seeder';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    SecurityModule,
  ],
  controllers: [AdminUserController, DeveloperController],
  providers: [
    CreateUserUseCase,
    { provide: USER_REPOSITORY, useClass: TypeOrmUserRepository },
    AdminSeeder,
  ],
})
export class UserModule {}