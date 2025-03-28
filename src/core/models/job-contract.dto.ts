import { AuditingDto } from "./auditing.dto";
import { EmployerProfileDto } from "./employer-profie.dto";
import { FreelancerProfileDto } from "./freelancer-profile.dto";
import { JobListingDto } from "./job-listing.dto";
import { JobProposalDto } from "./job-proposal.dto";

export enum JobStatus{
    ACTIVE = "active",
    COMPLETED = "completed",
    TERMINATED = "terminated"
}

export enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    PARTIAL = "partial",
    FAILED = "failed"
}

export class JobContractDto{
    id?: number;
    job?: JobListingDto;
    proposal?: JobProposalDto;
    employer?: EmployerProfileDto;
    freelancer?: FreelancerProfileDto;
    start_date?: string;
    end_date?: string;
    status?: JobStatus;
    payment_status?: PaymentStatus;
    payment_amount?: number;
    publishedAt?: string;
    audit?: AuditingDto;

    constructor(partial: Partial<JobContractDto> = {}) {
    Object.assign(this, partial);
  }
}