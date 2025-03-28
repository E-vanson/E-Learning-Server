import { IsDateString, IsNumber } from "class-validator";
import { FreelancerProfileDto } from "./freelancer-profile.dto";
import { ApiHideProperty } from "@nestjs/swagger";


export class UpdateJobProposalDto{
    @IsNumber()
    id: number;

    freelancer: FreelancerProfileDto;
    cover_letter: string;
    bid_amount: number;
    estimated_time: string;
    
    @IsDateString()
    updatedAt: string;
    
    @ApiHideProperty()
    updatedBy: string;
}