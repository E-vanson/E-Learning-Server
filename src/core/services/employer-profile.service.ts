import { PageDto } from "../models";
import { CreateEmployerProfileDto } from "../models/employer-profile-create.dto";
import { EmployerPayloadDto } from "../models/employer-profile-payload.dto";
import { EmployerProfileQueryDto } from "../models/employer-profile-query.dto";
import { UpdateEmployerProfileDto } from "../models/employer-profile-update.dto";

export interface EmployerProfileService{
    create(values: CreateEmployerProfileDto): Promise<EmployerPayloadDto>;

    update(values: UpdateEmployerProfileDto): Promise<EmployerPayloadDto>;
    
    findById(id: number): Promise<EmployerPayloadDto>;

    findByUsername(username: string): Promise<EmployerPayloadDto | undefined>;

    find(query: EmployerProfileQueryDto): Promise<PageDto<EmployerPayloadDto>>;        

    delete(id: number): Promise<undefined>
}

export const EMPLOYER_PROFILE_SERVICE = 'EmployerProfileService';