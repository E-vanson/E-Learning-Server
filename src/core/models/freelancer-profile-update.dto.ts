import { IsDateString, IsNumber } from "class-validator";
import { UserDto } from "./user.dto";
import { ApiHideProperty } from "@nestjs/swagger";


export class UpdateFreelancerProfileDto{
    @IsNumber()
    id: number;

    user?: UserDto;
    headline?: string;    
    overview: string;
    hourlyRate?: number;
    skills?: string[];
    portfolioLinks?: Record<string, string>; 

    @IsDateString()
    updatedAt: string;
    
    @ApiHideProperty()
    updatedBy: string;
}