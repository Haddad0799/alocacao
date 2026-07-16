import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../../domain/entity/project.entity';
import type { ProjectRepositoryPort } from '../../domain/port/project.repository.port';
import { ProjectEntity } from '../entity/project.entity.orm';

@Injectable()
export class TypeOrmProjectRepository implements ProjectRepositoryPort {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly repo: Repository<ProjectEntity>,
  ) {}

  async save(project: Project): Promise<Project> {
    const entity = this.repo.create({
      id: project.id,
      name: project.name,
      description: project.description,
      createdById: project.createdById,
    });
    const saved = await this.repo.save(entity);
    return Project.restore(saved.id, saved.name, saved.description, saved.createdById);
  }

  async findAll(): Promise<Project[]> {
    const rows = await this.repo.find();
    return rows.map((r) => Project.restore(r.id, r.name, r.description, r.createdById));
  }

  async findById(id: string): Promise<Project | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? Project.restore(row.id, row.name, row.description, row.createdById) : null;
  }
}