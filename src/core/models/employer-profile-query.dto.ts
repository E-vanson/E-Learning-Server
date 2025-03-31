import { IsOptional } from "class-validator";
import { QueryDto } from "./query.dto";
import { UserDto } from "./user.dto";



export class EmployerProfileQueryDto extends QueryDto{
    q?: string;

    @IsOptional()
    userId?: string;

    @IsOptional()
    companyName?: string;

    @IsOptional()
    companyDescription?: string;

    @IsOptional()
    website?: string;

    orderBy?: 'publishedAt'

    constructor(partial: Partial<EmployerProfileQueryDto> = {}) {
    super();
    Object.assign(this, partial);
  }
}