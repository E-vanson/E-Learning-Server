import { Transform } from "class-transformer";
import { UserDto } from "./user.dto";
import { AuditingDto } from "./auditing.dto";


export class FreelancerProfileDto{
    @Transform(({ value }) => Number(value))
    id: number;

    user?: UserDto;
    headline?: string;
    overview?: string;
    hourlyRate?: number;
    skills?: string[];
    portfolioLinks?: Record<string, string>;
    publishedAt?: string;    
    audit?: AuditingDto; 
    
    constructor(partial: Partial<FreelancerProfileDto> = {}) {
    Object.assign(this, partial);
  }
}