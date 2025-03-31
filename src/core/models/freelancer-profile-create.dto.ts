import { IsNotEmpty } from "class-validator";
import { UserDto } from "./user.dto";
import { AuditingDto } from "./auditing.dto";
import { PortfolioLinks } from "./freelancer-profile.dto";


export class CreateFreelancerProfileDto{
    userId?: string;
    
    @IsNotEmpty()
    headline: string;
    overview: string;
    hourlyRate?: number;
    skills?: string[];
    portfolioLinks?:PortfolioLinks[];        
}