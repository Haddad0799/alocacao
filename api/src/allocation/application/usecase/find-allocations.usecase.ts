import { Inject, Injectable } from '@nestjs/common';
import { ALLOCATION_REPOSITORY } from '../../domain/port/allocation.repository.port';
import type { AllocationRepositoryPort } from '../../domain/port/allocation.repository.port';
import { Allocation } from '../../domain/entity/allocation.entity';
import { Role } from '../../../user/domain/valueobject/role';

export interface Requester {
  id: string;
  role: string;
}

@Injectable()
export class FindAllocationsUseCase {
  constructor(
    @Inject(ALLOCATION_REPOSITORY)
    private readonly repo: AllocationRepositoryPort,
  ) {}

  async execute(requester: Requester): Promise<Allocation[]> {
    if (requester.role === Role.DEVELOPER) {
      return this.repo.findByDeveloperId(requester.id);
    }
    return this.repo.findAll();
  }
}