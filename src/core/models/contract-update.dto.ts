import { PartialType } from '@nestjs/mapped-types';
import { CreateContractDto } from './contract-create.dto';
import { IsDateString, IsEnum } from 'class-validator';
import { ContractStatus } from './contract.dto';
import { ApiHideProperty } from '@nestjs/swagger';

export class UpdateContractDto extends PartialType(CreateContractDto) {
  @IsEnum(ContractStatus)
  status?: ContractStatus;
    
    @IsDateString()
    updatedAt: string;

    @ApiHideProperty()
    updatedBy?: string;  
}