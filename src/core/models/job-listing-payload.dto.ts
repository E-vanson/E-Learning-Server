import { Exclude, Expose, Type } from 'class-transformer';
import { UserDto } from './user.dto';
import { JobStatus, BudgetType, ExperienceLevel } from './job-listing.dto';
import { AuditingDto } from './auditing.dto';

@Exclude()
export class JobResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => UserDto)
  employer: UserDto;

  @Expose()
  title: string;
    
  @Expose()
  slug: string;  

  @Expose()
  description: string;

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

  @Expose()
  status: JobStatus;
    
  audit?: AuditingDto;
}