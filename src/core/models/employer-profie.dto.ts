import { Expose, Transform } from 'class-transformer';
import { UserDto } from './user.dto';
import { AuditingDto } from './auditing.dto';
import { IsUUID } from 'class-validator';


export class EmployerProfileDto{
    @IsUUID('4')
    id: string;
  
    userId: string;
        
    companyName: string;
    companyDescription: string;
    website?: string;    

    audit?: AuditingDto;   

    constructor(partial: Partial<EmployerProfileDto> = {}) {
    Object.assign(this, partial);
  }
}