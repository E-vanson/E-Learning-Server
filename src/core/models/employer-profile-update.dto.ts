import { ApiHideProperty } from "@nestjs/swagger";
import { IsDateString, IsNumber, IsString } from "class-validator";
import { UserDto } from "./user.dto";


export class EmployerProfileUpdateDto{   
    userId?: string;
    
    companyName?: string;
    companyDescription?: string;
    website?: string;

    @ApiHideProperty()
    updatedBy?: string;
}