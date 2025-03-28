import { Transform } from "class-transformer";
import { FreelancerProfileDto } from "./freelancer-profile.dto";
import { AuditingDto } from "./auditing.dto";


export class JobProposalDto{
    @Transform(({ value }) => Number(value))
    id: number;

    freelancer: FreelancerProfileDto;
    cover_letter: string;
    bid_amount: number;
    estimated_time: string;
    status: string;
    publishedAt?: string;    
    audit?: AuditingDto; 

    constructor(partial: Partial<JobProposalDto> = {}) {
    Object.assign(this, partial);
  }

}