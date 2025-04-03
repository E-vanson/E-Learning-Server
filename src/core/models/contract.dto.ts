import { Expose, Type } from 'class-transformer';
import { IsUUID, IsNotEmpty, IsPositive, IsISO8601 } from 'class-validator';
import { EmployerProfileDto } from './employer-profie.dto';
import { JobListingDto } from './job-listing.dto';
import { FreelancerProfileDto } from './freelancer-profile.dto';
import { AuditingDto } from './auditing.dto';

export enum ContractStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  TERMINATED = 'TERMINATED'
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

    @IsUUID()
    employerId: string;

    @Expose()
    @Type(() => JobListingDto)
    job: JobListingDto;
    
    @IsUUID()
    jobId: string;

    @Expose()
    @Type(() => FreelancerProfileDto)
    freelancer: FreelancerProfileDto;

    @IsUUID()
    freelancerId: string;

    @IsNotEmpty()
    terms: ContractTerms;

    @IsISO8601()
    startDate: Date;

    @IsISO8601()
    endDate: Date;

    @IsPositive()
    paymentAmount: number;

    @IsNotEmpty()
    paymentCurrency: Currency;

    milestones?: Milestone[];

    status?: ContractStatus

    audit?: AuditingDto;

    constructor(partial: Partial<ContractDto> = {}) {
      Object.assign(this, partial)
    }
}