import { Expose } from "class-transformer";
import { UserDto } from "./user.dto";
import { AuditingDto } from "./auditing.dto";

export class FreelancerPayloadDto { 
    @Expose()
    id: number;

    @Expose()
    user: UserDto;

    @Expose()
    headline: string;

    @Expose()
    overview: string;
    hourlyRate?: number;
    skills?: string[];
    portfolioLinks?: Record<string, string>; 
    audit?: AuditingDto;
}