import { ApiHideProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { BudgetType, ExperienceLevel, JobStatus } from './job-listing.dto';

export class JobListingUpdateDto{
    @IsString()
    id?: string;
    
    @MaxLength(2000)
    title?: string;
    
    @MaxLength(2000)
    slug?: string;

    description?: string;

    skillsRequired?: string[];

    budget?: number;
  
    status?: JobStatus;

    @IsEnum(BudgetType)
    budgetType?: BudgetType;

    @IsDateString()
    deadline?: Date;

    @IsEnum(ExperienceLevel)
    experienceLevel?: ExperienceLevel;

    @IsDateString()
    updatedAt: string;

    @ApiHideProperty()
    updatedBy?: string;

}