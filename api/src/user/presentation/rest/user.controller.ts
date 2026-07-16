import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserUseCase } from '../../application/usecase/create-user.usecase';
import { CreateUserCommand } from '../../application/commands/create-user.command';
import { CreateUserDto } from '../dto/create-user.dto';
import { Role } from '../../domain/valueobject/role';
import { Roles } from '../../../auth/infrastructure/decorator/roles.decorator';
import { RolesGuard } from '../../../auth/infrastructure/guard/roles.guard';
import type { AuthUser} from '../../../auth/infrastructure/decorator/current-user.decorator';
import { CurrentUser } from '../../../auth/infrastructure/decorator/current-user.decorator';
import { ListUsersByRoleUseCase } from '../../application/usecase/list-users-by-roles.usecase';


@Controller('users')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly createUser: CreateUserUseCase,
    private readonly listByRole: ListUsersByRoleUseCase
  ) {}

  @Post('admins')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  createAdmin(@Body() dto: CreateUserDto) {
    return this.create(dto, Role.ADMIN);
  }

  @Post('managers')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  createManager(@Body() dto: CreateUserDto) {
    return this.create(dto, Role.MANAGER);
  }

  @Post('developers')
  @Roles(Role.ADMIN, Role.MANAGER)
  @HttpCode(HttpStatus.CREATED)
  createDeveloper(@Body() dto: CreateUserDto) {
    return this.create(dto, Role.DEVELOPER);
  }

@Get('me')
me(@CurrentUser() user: AuthUser) {
  return { id: user.id, role: user.role };
}

@Get('developers')
@Roles(Role.ADMIN, Role.MANAGER)
async listDevelopers() {
  const users = await this.listByRole.execute(Role.DEVELOPER);
  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email.value,
    role: u.role,
  }));
}

  private async create(dto: CreateUserDto, role: Role) {
    const user = await this.createUser.execute(
      new CreateUserCommand(dto.name, dto.email, dto.password, role),
    );
    return {
      id: user.id,
      name: user.name,
      email: user.email.value,
      role: user.role,
    };
  }
}