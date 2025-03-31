import { Expose, Transform } from 'class-transformer';
import { UserDto } from './user.dto';
import { AuditingDto } from './auditing.dto';


export class EmployerProfileDto{
    @Transform(({ value }) => Number(value))
    id: string;
    userId: string;
    
    @Expose()
    companyName: string;
    companyDescription: string;
    website?: string;
    publishedAt?: string;

    audit?: AuditingDto;   

    constructor(partial: Partial<EmployerProfileDto> = {}) {
    Object.assign(this, partial);
  }
}