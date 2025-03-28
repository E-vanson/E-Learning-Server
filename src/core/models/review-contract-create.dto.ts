import { Expose, Type } from 'class-transformer';
import { 
  IsInt, 
  IsOptional, 
  IsString, 
  Min, 
  Max, 
  IsDate, 
  IsNumber,
  IsPositive,
  MaxLength
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { UserDto } from './user.dto';
import { AuditingDto } from './auditing.dto';
import { JobContractDto } from './job-contract.dto';
import { EmployerProfileDto } from './employer-profie.dto';
import { FreelancerProfileDto } from './freelancer-profile.dto';


// Create DTO
export class CreateReviewDto {         
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
        
    publishedAt?: string;
    audit?: AuditingDto;  
}