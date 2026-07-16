import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CreateAllocationUseCase } from '../../application/usecase/create-allocation.usecase';
import { FindAllocationsUseCase } from '../../application/usecase/find-allocations.usecase';
import { CreateAllocationCommand } from '../../application/command/create-allocation.command';
import { CreateAllocationDto } from '../dto/create-allocation.dto';
import { Role } from '../../../user/domain/valueobject/role';
import { Roles } from '../../../auth/infrastructure/decorator/roles.decorator';
import { RolesGuard } from '../../../auth/infrastructure/guard/roles.guard';
import { CurrentUser } from '../../../auth/infrastructure/decorator/current-user.decorator';
import type { AuthUser } from '../../../auth/infrastructure/decorator/current-user.decorator';

@Controller('allocations')
@UseGuards(RolesGuard)
export class AllocationController {
  constructor(
    private readonly createAllocation: CreateAllocationUseCase,
    private readonly findAllocations: FindAllocationsUseCase,
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  @HttpCode(HttpStatus.CREATED)
  async create(@CurrentUser() user: AuthUser, @Body() dto: CreateAllocationDto) {
    const allocation = await this.createAllocation.execute(
      new CreateAllocationCommand(
        dto.projectId,
        dto.developerId,
        new Date(dto.startDate),
        new Date(dto.endDate),
        user.id,
      ),
    );
    return {
      id: allocation.id,
      projectId: allocation.projectId,
      developerId: allocation.developerId,
      startDate: allocation.startDate,
      endDate: allocation.endDate,
    };
  }

  @Get()
  async list(@CurrentUser() user: AuthUser) {
    const allocations = await this.findAllocations.execute({
      id: user.id,
      role: user.role,
    });
    return allocations.map((a) => ({
      id: a.id,
      projectId: a.projectId,
      developerId: a.developerId,
      startDate: a.startDate,
      endDate: a.endDate,
    }));
  }
}