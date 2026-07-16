import { Allocation } from '../entity/allocation.entity';

export const ALLOCATION_REPOSITORY = Symbol('ALLOCATION_REPOSITORY');

export interface AllocationRepositoryPort {
  save(allocation: Allocation): Promise<Allocation>;
  findAll(): Promise<Allocation[]>;
  findById(id: string): Promise<Allocation | null>;
  findByDeveloperId(developerId: string): Promise<Allocation[]>;
}