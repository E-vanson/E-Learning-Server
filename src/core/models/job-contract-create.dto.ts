import { Expose } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { JobListingDto } from "./job-listing.dto";
import { JobProposalDto } from "./job-proposal.dto";
import { EmployerProfileDto } from "./employer-profie.dto";
import { FreelancerProfileDto } from "./freelancer-profile.dto";
import { JobStatus, PaymentStatus } from "./job-contract.dto";


export class CreateJobContractDto {
    @IsNotEmpty()
    job?: JobListingDto;

    @IsNotEmpty()
    proposal: JobProposalDto;
    
    @IsNotEmpty()
    employer: EmployerProfileDto;

    @IsNotEmpty()
    freelancer: FreelancerProfileDto;

    @IsNotEmpty()
    start_date: string;

    @IsNotEmpty()
    end_date: string;

    @IsNotEmpty()
    status: JobStatus;

    @IsNotEmpty()
    payment_status: PaymentStatus;
    
}