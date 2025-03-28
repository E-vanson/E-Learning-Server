import { IsNotEmpty } from "class-validator";
import { UserDto } from "./user.dto";
import { AuditingDto } from "./auditing.dto";


export class CreateFreelancerProfileDto{
    user?: UserDto;
    
    @IsNotEmpty()
    headline: string;
    overview: string;
    hourlyRate?: number;
    skills?: string[];
    portfolioLinks?: Record<string, string>;        
}