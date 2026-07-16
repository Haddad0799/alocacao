import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Allocation } from '../../domain/entity/allocation.entity';
import type { AllocationRepositoryPort } from '../../domain/port/allocation.repository.port';
import { AllocationEntity } from '../entity/allocation.entity.orm';

@Injectable()
export class TypeOrmAllocationRepository implements AllocationRepositoryPort {
  constructor(
    @InjectRepository(AllocationEntity)
    private readonly repo: Repository<AllocationEntity>,
  ) {}

  async save(allocation: Allocation): Promise<Allocation> {
    const entity = this.repo.create({
      id: allocation.id,
      projectId: allocation.projectId,
      developerId: allocation.developerId,
      startDate: allocation.startDate,
      endDate: allocation.endDate,
      allocatedById: allocation.allocatedById,
    });
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  async findAll(): Promise<Allocation[]> {
    const rows = await this.repo.find();
    return rows.map(this.toDomain);
  }

  async findById(id: string): Promise<Allocation | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findByDeveloperId(developerId: string): Promise<Allocation[]> {
    const rows = await this.repo.find({ where: { developerId } });
    return rows.map(this.toDomain);
  }

  private toDomain(row: AllocationEntity): Allocation {
    return Allocation.restore(
      row.id,
      row.projectId,
      row.developerId,
      row.startDate,
      row.endDate,
      row.allocatedById,
    );
  }
}