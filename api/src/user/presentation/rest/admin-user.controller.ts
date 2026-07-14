import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/usecase/create-user.usecase';
import { CreateUserCommand } from '../../application/commands/create-user.command';
import { CreateUserDto } from '../dto/create-user.dto';
import { Role } from '../../domain/valueobject/role';
import { Roles } from '../../../auth/infrastructure/decorator/roles.decorator';
import { RolesGuard } from '../../../auth/infrastructure/guard/roles.guard';

@Controller('admin/users')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
export class AdminUserController {
  constructor(private readonly createUser: CreateUserUseCase) {}

  @Post('admins')
  @HttpCode(HttpStatus.CREATED)
  async createAdmin(@Body() dto: CreateUserDto) {
    const user = await this.createUser.execute(
      new CreateUserCommand(dto.name, dto.email, dto.password, Role.ADMIN),
    );
    return { id: user.id, name: user.name, email: user.email.value, role: user.role };
  }

  @Post('managers')
  @HttpCode(HttpStatus.CREATED)
  async createManager(@Body() dto: CreateUserDto) {
    const user = await this.createUser.execute(
      new CreateUserCommand(dto.name, dto.email, dto.password, Role.MANAGER),
    );
    return { id: user.id, name: user.name, email: user.email.value, role: user.role };
  }
}
