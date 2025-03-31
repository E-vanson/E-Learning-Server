import { PageDto } from "../models";
import { EmployerProfileDto } from "../models/employer-profie.dto";
import { CreateEmployerProfileDto } from "../models/employer-profile-create.dto";
import { EmployerPayloadDto } from "../models/employer-profile-payload.dto";
import { EmployerProfileQueryDto } from "../models/employer-profile-query.dto";
import { EmployerProfileUpdateDto } from "../models/employer-profile-update.dto";

export interface EmployerProfileService{
    create(userId: string, values: CreateEmployerProfileDto): Promise<EmployerProfileDto>;

    update(values:EmployerProfileUpdateDto): Promise<void>;
    
    findById(id: string): Promise<EmployerProfileDto | undefined>;

    // findByUsername(username: string): Promise<EmployerPayloadDto | undefined>;

    // find(query: EmployerProfileQueryDto): Promise<PageDto<EmployerPayloadDto>>;        

    delete(id: string): Promise<void>
}

export const EMPLOYER_PROFILE_SERVICE = 'EmployerProfileService';