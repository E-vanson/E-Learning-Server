import { IsUUID, IsNotEmpty, IsPositive, IsISO8601 } from 'class-validator';
import { ContractTerms, Currency, Milestone } from './contract.dto';

export class CreateContractDto {
  @IsUUID()
  jobId: string;

  @IsUUID()
  freelancerId: string;

  @IsNotEmpty()
  terms: ContractTerms;

  @IsISO8601()
  startDate: Date;

  @IsISO8601()
  endDate: Date;

  @IsPositive()
  paymentAmount: number;

  @IsNotEmpty()
  paymentCurrency: Currency;

  milestones?: Milestone[];
}