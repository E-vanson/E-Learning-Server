import { PartialType } from "@nestjs/swagger";
import { EmployerProfileDto } from "./employer-profie.dto";
import { IsNotEmpty } from "class-validator";
import { UserDto } from "./user.dto";


export class CreateEmployerProfileDto{
    
    user?: UserDto; 

    @IsNotEmpty()
    companyName: string;

    @IsNotEmpty()
    companydescription: string;

    @IsNotEmpty()
    website: string;
}