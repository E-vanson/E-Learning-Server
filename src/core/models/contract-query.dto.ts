import { IsEnum, IsISO8601, IsOptional, IsString, IsUUID } from "class-validator";
import { QueryDto } from "./query.dto";
import { ContractStatus } from "./contract.dto";

export class ContractQueryDto extends QueryDto {
  q?: string;

  @IsOptional()
  @IsUUID()
  jobId?: string;

  @IsOptional()
  @IsUUID()
  freelancerId?: string;

  @IsString()
  @IsOptional()
  terms?: string;

  @IsOptional()
  @IsUUID()
  employerId?: string;

  @IsOptional()
  @IsEnum(ContractStatus)
  status?: ContractStatus;

  @IsOptional()
  @IsISO8601()
  startDateBefore?: Date;

  @IsOptional()
  @IsISO8601()
  endDateAfter?: Date;

  orderBy?: 'publishedAt';  

    constructor(partial: Partial<ContractQueryDto> = {}) {
        super();
        Object.assign(this, partial);
    }
}