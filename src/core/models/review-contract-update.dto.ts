import { IsDateString, IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";
import { EmployerProfileDto } from "./employer-profie.dto";
import { FreelancerProfileDto } from "./freelancer-profile.dto";
import { JobContractDto } from "./job-contract.dto";
import { AuditingDto } from "./auditing.dto";
import { ApiHideProperty } from "@nestjs/swagger";

export class UpdareReviewDto {         
    contract: JobContractDto;  
        
    reviewer: EmployerProfileDto;
        
    reviewee: FreelancerProfileDto;

    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    comment?: string;
        
    
    @IsDateString()
    updatedAt: string;
    
    @ApiHideProperty()
    updatedBy: string; 
}