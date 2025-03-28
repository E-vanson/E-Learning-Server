import { Expose } from "class-transformer";
import { AuditingDto } from "./auditing.dto";
import { UserDto } from "./user.dto";


export class EmployerPayloadDto{
    @Expose()
    id: number;

    @Expose()
    user?: UserDto;        

    @Expose()
    companyName: string;

    @Expose()
    companyDescription: string;

    @Expose()
    website: string;

    audit?: AuditingDto;
}