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

@Controller('developers')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER)
export class DeveloperController {
  constructor(private readonly createUser: CreateUserUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUserDto) {
    const user = await this.createUser.execute(
      new CreateUserCommand(dto.name, dto.email, dto.password, Role.DEVELOPER),
    );
    return {
      id: user.id,
      name: user.name,
      email: user.email.value,
      role: user.role,
    };
  }
}