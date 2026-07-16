import { IsArray, IsIn, IsInt, IsString, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SkillDto {
  @IsString()
  name!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  level!: number;
}

export class CreateDeveloperProfileDto {
  @IsIn(['JUNIOR', 'PLENO', 'SENIOR'])
  seniority!: string;

  @IsArray()
  @IsString({ each: true })
  stack!: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillDto)
  skills!: SkillDto[];
}