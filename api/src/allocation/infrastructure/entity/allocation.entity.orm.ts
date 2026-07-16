import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('allocations')
export class AllocationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  projectId!: string;

  @Column()
  developerId!: string;

  @Column({ type: 'date' })
  startDate!: Date;

  @Column({ type: 'date' })
  endDate!: Date;

  @Column()
  allocatedById!: string;
}