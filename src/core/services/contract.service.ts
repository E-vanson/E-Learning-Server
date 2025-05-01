import { PageDto } from "../models";
import { CreateContractDto } from "../models/contract-create.dto";
import { ContractQueryDto } from "../models/contract-query.dto";
import { UpdateContractDto } from "../models/contract-update.dto";
import { ContractDto } from "../models/contract.dto";



export interface ContractService {
    create(userId: string, values: CreateContractDto): Promise<boolean>;

    update(userId: string, contractId: string, values: UpdateContractDto): Promise<boolean>;

    findById(id: string): Promise<ContractDto | undefined>;

    find(query: ContractQueryDto): Promise<PageDto<ContractDto>>;

    delete(id: string): Promise<boolean>;

    isContractOwner(userId: string, contractId: string): Promise<boolean>;
}

export const CONTRACT_SERVICE = 'ContractService';