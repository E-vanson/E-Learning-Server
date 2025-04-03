import { isNotEmpty, IsNotEmpty } from "class-validator";
import { JobListingDto } from "./job-listing.dto";
import { FreelancerProfileDto } from "./freelancer-profile.dto";
import { ProposalStatus } from "./job-proposal.dto";


export class CreateJobProposalDto{
    
    job?: JobListingDto;

    jobId?: string;

    freelancer?: FreelancerProfileDto;

    freelancer_Id: string;

    @IsNotEmpty()
    cover_letter: string;

    @IsNotEmpty()
    bid_amount: number;

    @IsNotEmpty()
    estimated_time: string;

    status?: ProposalStatus;

    


}