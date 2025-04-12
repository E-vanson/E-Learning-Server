import { ApiProperty, PartialType } from "@nestjs/swagger";
import { EmployerProfileDto } from "./employer-profie.dto";
import { IsNotEmpty } from "class-validator";
import { UserDto } from "./user.dto";


export class CreateEmployerProfileDto{
    @ApiProperty({ example: 'nnd3r0r40s4' })
    userId: string; 

    @ApiProperty({ example: 'Tech Corp' })
    @IsNotEmpty()
    companyName: string;

    @ApiProperty({ example: 'Tech Corp' })
    @IsNotEmpty()
    companyDescription: string;

    @ApiProperty({ example: 'Tech Corp' })
    @IsNotEmpty()
    website: string;
}