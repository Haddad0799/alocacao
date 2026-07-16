import { Project } from '../entity/project.entity';

export const PROJECT_REPOSITORY = Symbol('PROJECT_REPOSITORY');

export interface ProjectRepositoryPort {
  save(project: Project): Promise<Project>;
  findAll(): Promise<Project[]>;
  findById(id: string): Promise<Project | null>;
}