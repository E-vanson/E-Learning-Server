import { IsInt, Max, Min } from "class-validator";
import { EmployerProfileDto } from "./employer-profie.dto";
import { FreelancerProfileDto } from "./freelancer-profile.dto";
import { JobContractDto } from "./job-contract.dto";
import { QueryDto } from "./query.dto"


export class ReviewQueryDto extends QueryDto { 
    q?: string;
    contract: JobContractDto;  
            
    reviewer: EmployerProfileDto;
    
    reviewee: FreelancerProfileDto;
        
    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;
    
    constructor(partial: Partial<ReviewQueryDto> = {}) {
        super();
        Object.assign(this, partial);
    }
}