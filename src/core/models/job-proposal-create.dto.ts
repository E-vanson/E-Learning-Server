import { isNotEmpty, IsNotEmpty } from "class-validator";
import { JobListingDto } from "./job-listing.dto";
import { FreelancerProfileDto } from "./freelancer-profile.dto";


export class CreateJobProposalDto{
    @IsNotEmpty()
    job: JobListingDto;

    freelancer: FreelancerProfileDto;

    @IsNotEmpty()
    cover_letter: string;

    @IsNotEmpty()
    bid_amount: number;

    @IsNotEmpty()
    estimated_time: string;

    


}