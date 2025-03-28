import { EmployerProfileDto } from "./employer-profie.dto";
import { FreelancerProfileDto } from "./freelancer-profile.dto";
import { JobListingDto } from "./job-listing.dto";
import { QueryDto } from "./query.dto";


export class JobContractQueryDto extends QueryDto {
    q?: string;
    job?: JobListingDto;
    employer?: EmployerProfileDto;
    freelancer?: FreelancerProfileDto;
    orderBy?: 'publishedAt';

    constructor(partial: Partial<JobContractQueryDto> = {}) {
        super();
        Object.assign(this, partial);
    }

}