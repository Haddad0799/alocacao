import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CreateProjectUseCase } from '../../application/usecase/create-project.usecase';
import { CreateProjectCommand } from '../../application/command/create-project.command';
import { CreateProjectDto } from '../dto/create-project.dto';
import { Role } from '../../../user/domain/valueobject/role';
import { Roles } from '../../../auth/infrastructure/decorator/roles.decorator';
import { RolesGuard } from '../../../auth/infrastructure/guard/roles.guard';
import { CurrentUser } from '../../../auth/infrastructure/decorator/current-user.decorator';
import type { AuthUser } from '../../../auth/infrastructure/decorator/current-user.decorator';
import { TypeOrmProjectRepository } from '../../infrastructure/persistence/typeorm-project.repository';

@Controller('projects')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER)
export class ProjectController {
  constructor(
    private readonly createProject: CreateProjectUseCase,
    private readonly repo: TypeOrmProjectRepository,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@CurrentUser() user: AuthUser, @Body() dto: CreateProjectDto) {
    const project = await this.createProject.execute(
      new CreateProjectCommand(dto.name, dto.description ?? '', user.id),
    );
    return { id: project.id, name: project.name, description: project.description };
  }

  @Get()
  async list() {
    const projects = await this.repo.findAll();
    return projects.map((p) => ({ id: p.id, name: p.name, description: p.description }));
  }
}