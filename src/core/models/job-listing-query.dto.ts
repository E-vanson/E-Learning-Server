import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { JobStatus, BudgetType, ExperienceLevel } from './job-listing.dto';
import { QueryDto } from './query.dto';

export class JobListingQueryDto extends QueryDto {
  q?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsOptional()
  @IsString({ each: true })
  skillsRequired?: string[];

  @IsOptional()
  @IsNumber()
  minBudget?: number; 

  @IsOptional()
  @IsNumber()
  maxBudget?: number;

  @IsOptional()
  @IsEnum(BudgetType)
  budgetType?: BudgetType;

  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @IsOptional()
  @IsString()
  experienceLevel?: ExperienceLevel;

  @IsOptional()
  @IsString()
  start?: string; // Start date

  @IsOptional()
  @IsString()
  end?: string; // End date
    
  orderBy?: 'publishedAt';
  
  constructor(partial: Partial<JobListingQueryDto> = {}) {
      super();
      Object.assign(this, partial);
  }

}