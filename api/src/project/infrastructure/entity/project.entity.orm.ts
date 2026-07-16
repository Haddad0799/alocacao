import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('projects')
export class ProjectEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
description!: string;

  @Column()
  createdById!: string;
}