import { ApiHideProperty } from "@nestjs/swagger";
import { IsDateString, IsNumber } from "class-validator";
import { UserDto } from "./user.dto";


export class UpdateEmployerProfileDto{
    @IsNumber()
    id: number;

    user?: UserDto;
    
    companyName?: string;
    companyDescription?: string;
    website?: string;

    @IsDateString()
    updatedAt: string;
    
    @ApiHideProperty()
    updatedBy: string;
}