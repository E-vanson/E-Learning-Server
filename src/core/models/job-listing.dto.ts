import { Expose, Type } from "class-transformer";
import { UserDto } from "./user.dto";
import { AuditingDto } from "./auditing.dto";

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
  @Expose()
  id: string;

  @Expose()
  @Type(() => UserDto)
  employer: UserDto;

  @Expose()
  title: string;

  @Expose()
  description: string;
    
  slug: string;  

  @Expose()
  skillsRequired: string[];

  @Expose()
  budget: number | null;

  @Expose()
  budgetType: BudgetType | null;

  @Expose()
  deadline: Date;

  @Expose()
  experienceLevel: ExperienceLevel | null;
    
  publishedAt?: string;
    
  publishedBy?: string;

  @Expose()
  status: JobStatus;
    
  audit?: AuditingDto;
     
  constructor(partial: Partial<JobListingDto> = {}) {
      Object.assign(this, partial)
  }

}