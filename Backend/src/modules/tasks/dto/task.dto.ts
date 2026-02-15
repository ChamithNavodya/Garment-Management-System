import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

enum TaskStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class CreateTaskTypeDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}

export class UpdateTaskTypeDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  price?: number;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}

export class CreateCompletedTaskDto {
  @IsString()
  employeeId: string;

  @IsString()
  taskTypeId: string;

  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class BulkTaskEntryDto {
  @IsString()
  taskTypeId: string;

  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateBulkCompletedTasksDto {
  @IsString()
  employeeId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkTaskEntryDto)
  entries: BulkTaskEntryDto[];
}

export class SubmissionTaskEntryDto {
  @IsString()
  taskTypeId: string;

  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateTaskSubmissionDto {
  @IsString()
  employeeId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubmissionTaskEntryDto)
  tasks: SubmissionTaskEntryDto[];

  @IsString()
  @IsOptional()
  notes?: string;
}
