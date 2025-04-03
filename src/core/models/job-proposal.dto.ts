import { Expose, Transform, Type } from "class-transformer";
import { FreelancerProfileDto } from "./freelancer-profile.dto";
import { AuditingDto } from "./auditing.dto";
import { JobListingDto } from "./job-listing.dto";

export enum ProposalStatus {
  SUBMITTED = 'submitted',
  REVIEWED = 'reviewed',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  SHORTLISTED = 'shortlisted',
}
export class JobProposalDto{    
    id?: string;
    @Expose()
    @Type(() => JobListingDto)         
    job: JobListingDto;
    jobId: string;
    @Expose() 
    @Type(() => FreelancerProfileDto)   
    freelancer: FreelancerProfileDto;
    freelancerId: string;
    cover_letter: string;
    bid_amount: number;
    estimated_time: string;
    status: ProposalStatus;
    employerFeedback: string;
    reviewedAt?: string;
    reviewedBy?: string;
    publishedAt?: string;
    publishedBy?: string;
    audit?: AuditingDto; 

    constructor(partial: Partial<JobProposalDto> = {}) {
    Object.assign(this, partial);
  }

}