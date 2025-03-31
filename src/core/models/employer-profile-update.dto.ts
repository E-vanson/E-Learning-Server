import { ApiHideProperty } from "@nestjs/swagger";
import { IsDateString, IsNumber, IsString } from "class-validator";
import { UserDto } from "./user.dto";


export class EmployerProfileUpdateDto{
    @IsString()
    id: string;
    userId?: string;
    
    companyName?: string;
    companyDescription?: string;
    website?: string;

    @IsDateString()
    updatedAt: string;
    
    @ApiHideProperty()
    updatedBy?: string;
}