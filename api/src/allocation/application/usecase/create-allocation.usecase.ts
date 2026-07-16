import { Inject, Injectable } from '@nestjs/common';
import { ALLOCATION_REPOSITORY } from '../../domain/port/allocation.repository.port';
import type { AllocationRepositoryPort } from '../../domain/port/allocation.repository.port';
import { Allocation } from '../../domain/entity/allocation.entity';
import { CreateAllocationCommand } from '../command/create-allocation.command';

@Injectable()
export class CreateAllocationUseCase {
  constructor(
    @Inject(ALLOCATION_REPOSITORY)
    private readonly repo: AllocationRepositoryPort,
  ) {}

  async execute(command: CreateAllocationCommand): Promise<Allocation> {
    const allocation = Allocation.create(
      command.projectId,
      command.developerId,
      command.startDate,
      command.endDate,
      command.allocatedById,
    );
    return this.repo.save(allocation);
  }
}