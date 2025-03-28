import { Expose, Transform } from "class-transformer";
import { FreelancerPayloadDto } from "./freelancer-profile-payload.dto";
import { AuditingDto } from "./auditing.dto";


export class JobProposalPayloadDto{
    @Expose()
    id: number;

    @Expose()
    freelancer?: FreelancerPayloadDto;

    @Expose()
    cover_letter?: string;

    @Expose()
    bid_amount?: number;

    @Expose()
    estimated_time?: string;

    audit?: AuditingDto;

    @Transform(({ value }) => value.toISOString())
    createdAt: Date;
    @Transform(({ value }) => value.toISOString())
    updatedAt: Date;

}