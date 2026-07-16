import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CreateDeveloperProfileUseCase } from '../../application/usecase/create-developer-profile.usecase';
import { CreateDeveloperProfileCommand } from '../../application/commands/create-developer-profile.command';
import { CreateDeveloperProfileDto } from '../dto/create-developer-profile.dto';
import { Role } from '../../../user/domain/valueobject/role';
import { Roles } from '../../../auth/infrastructure/decorator/roles.decorator';
import { RolesGuard } from '../../../auth/infrastructure/guard/roles.guard';
import { CurrentUser } from '../../../auth/infrastructure/decorator/current-user.decorator';
import type { AuthUser } from '../../../auth/infrastructure/decorator/current-user.decorator';
import type { Seniority } from '../../domain/entity/developer-profile.entity';

@Controller('developers')
@UseGuards(RolesGuard)
export class DeveloperProfileController {
  constructor(private readonly createProfile: CreateDeveloperProfileUseCase) {}

  @Post('me/profile')
  @Roles(Role.DEVELOPER)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateDeveloperProfileDto,
  ) {
    return this.createProfile.execute(
      new CreateDeveloperProfileCommand(
        user.id,
        dto.seniority as Seniority,
        dto.stack,
        dto.skills,
      ),
    );
  }
}