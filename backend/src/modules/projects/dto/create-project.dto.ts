import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  IsUUID,
} from 'class-validator';
import { ProjectStatus } from '../project.entity';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsUUID()
  @IsNotEmpty()
  projectManagerId: string;
}
