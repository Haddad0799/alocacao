import { Inject, Injectable } from '@nestjs/common';
import { PROJECT_REPOSITORY } from '../../domain/port/project.repository.port';
import type { ProjectRepositoryPort } from '../../domain/port/project.repository.port';
import { Project } from '../../domain/entity/project.entity';
import { CreateProjectCommand } from '../command/create-project.command';

@Injectable()
export class CreateProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly repo: ProjectRepositoryPort,
  ) {}

  async execute(command: CreateProjectCommand): Promise<Project> {
    const project = Project.create(command.name, command.description, command.createdById);
    return this.repo.save(project);
  }
}