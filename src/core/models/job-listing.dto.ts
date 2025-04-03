import { Expose, Type } from "class-transformer";
import { UserDto } from "./user.dto";
import { AuditingDto } from "./auditing.dto";
import { EmployerProfileDto } from "./employer-profie.dto";

export enum BudgetType {
  FIXED = 'fixed',
  HOURLY = 'hourly',
}

export enum JobStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  CLOSED = 'closed',
}

export enum ExperienceLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  EXPERIENCED = 'experienced',
}

export class JobListingDto{  
  id?: string;

  @Expose()
  @Type(() => EmployerProfileDto)
  employer: EmployerProfileDto;

  employerId?: string;

  @Expose()
  title: string;

  @Expose()
  description: string;
    
  slug: string;  

  @Expose()
  skillsRequired: string[];

  @Expose()
  budget: number ;

  @Expose()
  budgetType: BudgetType;

  @Expose()
  deadline: Date;

  @Expose()
  experienceLevel: ExperienceLevel;
    
  publishedAt?: string;
    
  publishedBy?: string;

  @Expose()
  status: JobStatus;
    
  audit?: AuditingDto;
     
  constructor(partial: Partial<JobListingDto> = {}) {
      Object.assign(this, partial)
  }

}