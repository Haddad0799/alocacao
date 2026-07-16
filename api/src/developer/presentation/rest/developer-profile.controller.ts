import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateDeveloperProfileUseCase } from '../../application/usecase/create-developer-profile.usecase';
import { UpdateDeveloperProfileUseCase } from '../../application/usecase/update-developer-profile.usecase';
import { CreateDeveloperProfileCommand } from '../../application/commands/create-developer-profile.command';
import { CreateDeveloperProfileDto } from '../dto/create-developer-profile.dto';
import { Role } from '../../../user/domain/valueobject/role';
import { Roles } from '../../../auth/infrastructure/decorator/roles.decorator';
import { RolesGuard } from '../../../auth/infrastructure/guard/roles.guard';
import { CurrentUser } from '../../../auth/infrastructure/decorator/current-user.decorator';
import type { AuthUser } from '../../../auth/infrastructure/decorator/current-user.decorator';
import type { Seniority } from '../../domain/entity/developer-profile.entity';
import { UpdateDeveloperProfileDto } from '../dto/update-developer-profile.dto';
import { DeveloperProfileResponseDto } from '../dto/developer-profile.response.dto';
import { GetDeveloperProfileUseCase } from '../../application/usecase/get-developer-profile.usecase';

@Controller('developers')
@UseGuards(RolesGuard)
export class DeveloperProfileController {
  constructor(
    private readonly createProfile: CreateDeveloperProfileUseCase,
    private readonly updateProfile: UpdateDeveloperProfileUseCase,
    private readonly getProfile: GetDeveloperProfileUseCase,
  ) {}

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

  @Patch('me/profile')
  @Roles(Role.DEVELOPER)
  async update(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateDeveloperProfileDto, 
  ) {
    return this.updateProfile.execute(user.id, dto);
  }

  @Get('me/profile')
async get(@CurrentUser() user: AuthUser) {
  const profile = await this.getProfile.execute(user.id);

  if (!profile) {
    throw new NotFoundException('Perfil não encontrado');
  }

  return new DeveloperProfileResponseDto(
    profile.id!,
    profile.seniority,
    profile.stack,
    profile.skills,
    profile.available,
  );
}

}


