import { Transform } from "class-transformer";
import { UserDto } from "./user.dto";
import { AuditingDto } from "./auditing.dto";

export interface PortfolioLinks{
  platform: string; 
  url: string;  
}

export class FreelancerProfileDto{   
    id: string;

    userId?: string;
    headline?: string;
    overview?: string;
    hourlyRate?: number;
    skills?: string[];
    portfolioLinks?: PortfolioLinks[];
    publishedAt?: string;    
    audit?: AuditingDto; 
    
    constructor(partial: Partial<FreelancerProfileDto> = {}) {
    Object.assign(this, partial);
  }
}