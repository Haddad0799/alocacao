import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './infrastructure/entity/project.entity.orm';
import { TypeOrmProjectRepository } from './infrastructure/persistence/typeorm-project.repository';
import { PROJECT_REPOSITORY } from './domain/port/project.repository.port';
import { CreateProjectUseCase } from './application/usecase/create-project.usecase';
import { ProjectController } from './presentation/rest/project.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity])],
  controllers: [ProjectController],
  providers: [
    CreateProjectUseCase,
    TypeOrmProjectRepository,
    { provide: PROJECT_REPOSITORY, useClass: TypeOrmProjectRepository },
  ],
  exports: [TypeOrmProjectRepository],
})
export class ProjectModule {}