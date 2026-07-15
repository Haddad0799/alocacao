import {
  Body,
  Controller,
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

@Controller('users')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly createUser: CreateUserUseCase) {}

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