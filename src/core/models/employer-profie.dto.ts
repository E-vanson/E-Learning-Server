import { Expose, Transform } from 'class-transformer';
import { UserDto } from './user.dto';
import { AuditingDto } from './auditing.dto';


export class EmployerProfileDto{
    @Transform(({ value }) => Number(value))
    id: number;
    user: UserDto;
    
    @Expose()
    companyName: string;
    companyDescription: string;
    website?: string;

    audit?: AuditingDto;
    publishedAt?: string;

    constructor(partial: Partial<EmployerProfileDto> = {}) {
    Object.assign(this, partial);
  }
}