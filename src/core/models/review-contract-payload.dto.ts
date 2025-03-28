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
import { JobContractDto } from './job-contract.dto';
import { EmployerProfileDto } from './employer-profie.dto';
import { FreelancerProfileDto } from './freelancer-profile.dto';
import { AuditingDto } from './auditing.dto';

export class ReviewContractPayloadDto{
    @IsInt()
      @IsPositive()
      Id: number;
        
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