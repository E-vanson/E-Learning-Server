import { IsDateString, IsNumber, IsOptional } from "class-validator";
import { FreelancerProfileDto } from "./freelancer-profile.dto";
import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { ProposalStatus } from "./job-proposal.dto";


export class UpdateJobProposalDto{    
  @ApiProperty({ required: false })
  @IsOptional()
  cover_letter?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  bid_amount?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  file_attachment?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  estimated_time?: string;
    
  @IsDateString()
  updatedAt: string;

  @ApiHideProperty()
  updatedBy?: string;  
}