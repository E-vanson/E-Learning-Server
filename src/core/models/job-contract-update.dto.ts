import { IsDateString, IsNotEmpty } from "class-validator";
import { JobStatus, PaymentStatus } from "./job-contract.dto";
import { ApiHideProperty } from "@nestjs/swagger";


export class UpdateJobContract{
    @IsNotEmpty()
    id: number;

    start_date?: string;
    end_date?: string;
    status?: JobStatus;
    payment_status?: PaymentStatus;
    payment_amount?: number;

    @IsDateString()
    updatedAt: string;
    
    @ApiHideProperty()
    updatedBy: string;
}