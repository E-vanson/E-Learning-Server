import { PageDto } from "../models";
import { EmployerDashboardSummarDto } from "../models/employer-dashboard-summart.dto";
import { EmployerProfileDto } from "../models/employer-profie.dto";
import { CreateEmployerProfileDto } from "../models/employer-profile-create.dto";
import { EmployerPayloadDto } from "../models/employer-profile-payload.dto";
import { EmployerProfileQueryDto } from "../models/employer-profile-query.dto";
import { EmployerProfileUpdateDto } from "../models/employer-profile-update.dto";

export interface EmployerProfileService{
    create(userId: string, values: CreateEmployerProfileDto): Promise<EmployerProfileDto>;

    update(profileId: string, values:EmployerProfileUpdateDto): Promise<EmployerProfileDto | null>;
    
    findById(id: string): Promise<EmployerProfileDto | undefined>;

    findByUserId(userId:    string): Promise<EmployerProfileDto | undefined>;

    findByCompanyName(companyName: string): Promise<EmployerProfileDto | undefined>;

    find(query: EmployerProfileQueryDto): Promise<PageDto<EmployerProfileDto>>;        

    delete(id: string): Promise<boolean>;

    getSummary(userId: string): Promise<EmployerDashboardSummarDto | undefined>;
}

export const EMPLOYER_PROFILE_SERVICE = 'EmployerProfileService';