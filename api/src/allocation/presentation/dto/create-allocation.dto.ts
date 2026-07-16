import { IsDateString, IsUUID } from 'class-validator';

export class CreateAllocationDto {
  @IsUUID()
  projectId!: string;

  @IsUUID()
  developerId!: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;
}