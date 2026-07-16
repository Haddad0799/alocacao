import { IsArray, IsEnum, IsInt, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SkillDto {
  @IsString()
  name!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  level!: number;
}

export class UpdateDeveloperProfileDto {
  @IsOptional()
  @IsEnum(['JUNIOR', 'PLENO', 'SENIOR'])
  seniority?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  stack?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillDto)
  skills?: SkillDto[];
}