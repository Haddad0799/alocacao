import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AllocationEntity } from './infrastructure/entity/allocation.entity.orm';
import { TypeOrmAllocationRepository } from './infrastructure/persistence/typeorm-allocation.repository';
import { ALLOCATION_REPOSITORY } from './domain/port/allocation.repository.port';
import { CreateAllocationUseCase } from './application/usecase/create-allocation.usecase';
import { FindAllocationsUseCase } from './application/usecase/find-allocations.usecase';
import { AllocationController } from './presentation/rest/allocation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AllocationEntity])],
  controllers: [AllocationController],
  providers: [
    CreateAllocationUseCase,
    FindAllocationsUseCase,
    TypeOrmAllocationRepository,
    { provide: ALLOCATION_REPOSITORY, useClass: TypeOrmAllocationRepository },
  ],
})
export class AllocationModule {}