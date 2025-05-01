import { Expose, Type } from 'class-transformer';
import { IsUUID, IsNotEmpty, IsPositive, IsISO8601 } from 'class-validator';
import { EmployerProfileDto } from './employer-profie.dto';
import { JobListingDto } from './job-listing.dto';
import { FreelancerProfileDto } from './freelancer-profile.dto';
import { AuditingDto } from './auditing.dto';

export enum ContractStatus {
  draft = 'draft',
  active = 'active',
  completed = 'completed',
  terminated = 'terminated'
}

export interface ContractTerms {
  scopeOfWork: string;
  paymentSchedule: string;
  terminationClause: string;
}

export interface Milestone {
  description: string;
  dueDate: Date;
  amount: number;
  completed: boolean;
}

export enum Currency {
    DOLLAR = '$',
    POUND = '£',
    EURO = '€',
    KSH = 'ksh'

}

export class ContractDto {
    id?: string;  
    
    @Expose()
    @Type(() => EmployerProfileDto)
    employer: EmployerProfileDto;    

    @Expose()
    @Type(() => JobListingDto)
    job: JobListingDto; 

    @Expose()
    @Type(() => FreelancerProfileDto)
    freelancer: FreelancerProfileDto;

    @IsUUID()
    jobId: string;

    @IsUUID()
    freelancerId: string;
            
    @IsUUID()
    employerId: string;  


    @Expose()
    @IsNotEmpty()
    terms: ContractTerms;

    @Expose()
    @IsISO8601()
    startDate: Date;

    @Expose()
    @IsISO8601()
    endDate: Date;

    @Expose()    
    @IsPositive()
    paymentAmount: number;

    @Expose()
    @IsNotEmpty()
    paymentCurrency: Currency;

    milestones?: Milestone[];

    status?: ContractStatus

    audit?: AuditingDto;

    constructor(partial: Partial<ContractDto> = {}) {
      Object.assign(this, partial)
    }
}