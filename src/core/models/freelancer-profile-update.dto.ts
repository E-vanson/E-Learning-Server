import { IsArray, IsDateString, IsNumber } from "class-validator";
import { UserDto } from "./user.dto";
import { ApiHideProperty } from "@nestjs/swagger";
import { PortfolioLinks } from "./freelancer-profile.dto";


export class UpdateFreelancerProfileDto{        
    userId?: string;
    headline?: string;    
    overview: string;
    hourlyRate?: number;
    @IsArray()
    skills?: string[];
    @IsArray()
    portfolioLinks?: PortfolioLinks[];     
    @ApiHideProperty()
    updatedBy: string;
}