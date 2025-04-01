import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  MaxLength,
} from 'class-validator';
import { UserDto } from './user.dto';
import { BudgetType, ExperienceLevel, JobStatus } from './job-listing.dto';

export class JobListingCreateDto{    
    @IsNotEmpty()
    @MaxLength(2000)
    title: string;
    
    employer?: UserDto;

    employerId?: string;

    description?: string;

    @IsNotEmpty()
    @MaxLength(2000)
    slug: string;

    @IsArray()
    skillsRequired: string[];

    budget: number;

    budgetType: BudgetType;

    deadline: Date;

    experienceLevel: ExperienceLevel;

    status: JobStatus;    

}