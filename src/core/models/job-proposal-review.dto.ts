import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional } from "class-validator";
import { ProposalStatus } from "./job-proposal.dto";


export class JobProposalReviewDto{
    @ApiProperty({ required: false, enum: ProposalStatus })
    @IsOptional()
    status?: ProposalStatus;

    @IsOptional()
    employerFeedback?: string

    @IsDateString()
    reviewedAt: string;

    @IsOptional()
    reviewedBy: string;
}