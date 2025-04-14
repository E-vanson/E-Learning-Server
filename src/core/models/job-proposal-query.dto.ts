import { IsEnum, IsOptional } from "class-validator";
import { QueryDto } from "./query.dto";
import { JobListingDto } from "./job-listing.dto";
import { FreelancerProfileDto } from "./freelancer-profile.dto";
import { ProposalStatus } from "./job-proposal.dto";


export class JobProposalQueryDto extends QueryDto{
    q?: string;

    // @IsOptional()
    // job?: JobListingDto;
        
  // freelancer?: FreelancerProfileDto;
  
    jobId?: string;

    freelancerId?: string;

    @IsOptional()
    cover_letter?: string;

    @IsOptional()
    bid_amount?: number;

    @IsOptional()
    estimated_time?: string;

    @IsOptional()
    @IsEnum(ProposalStatus)
    status?: ProposalStatus;

    orderBy?: 'publishedAt'

    constructor(partial: Partial<JobProposalQueryDto> = {}) {
    super();
    Object.assign(this, partial);
  }
}