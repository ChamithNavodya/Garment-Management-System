import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EmployeeType, EmployeeStatus, Gender } from '@prisma/client';

export class SalaryConfigDto {
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  basicSalary: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  allowance?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  epfPercentage?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  etfPercentage?: number;
}

export class CreateEmployeeDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  phone: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  nicNumber: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsInt()
  @Min(18)
  @Type(() => Number)
  age: number;

  @IsEnum(EmployeeType)
  @IsOptional()
  employeeType: EmployeeType;

  @IsEnum(EmployeeStatus)
  @IsOptional()
  status?: EmployeeStatus;

  @IsOptional()
  @ValidateNested()
  @Type(() => SalaryConfigDto)
  permanent?: SalaryConfigDto;
}

export class UpdateEmployeeDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  nicNumber?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsInt()
  @Min(18)
  @Type(() => Number)
  @IsOptional()
  age?: number;

  @IsEnum(EmployeeType)
  @IsOptional()
  employeeType?: EmployeeType;

  @IsEnum(EmployeeStatus)
  @IsOptional()
  status?: EmployeeStatus;

  @IsOptional()
  @ValidateNested()
  @Type(() => SalaryConfigDto)
  permanent?: SalaryConfigDto;
}
