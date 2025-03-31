import { IsOptional } from "class-validator";
import { QueryDto } from "./query.dto"
import { UserDto } from "./user.dto";


export class FreelancerProfileQueryDto extends QueryDto{
    q?: string;

    userId?: string;

    @IsOptional()
    headline?: string;    

    @IsOptional()
    hourlyrate?: number;

    @IsOptional()
    skills?: string[];

    orderBy?: 'publishedAt'

    constructor(partial: Partial<FreelancerProfileQueryDto> = {}) {
    super();
    Object.assign(this, partial);
  }
}