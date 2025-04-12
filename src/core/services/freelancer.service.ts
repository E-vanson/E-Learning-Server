import { CreateFreelancerProfileDto } from "../models/freelancer-profile-create.dto";
import { FreelancerProfileDto } from "../models/freelancer-profile.dto";
import { UpdateFreelancerProfileDto } from "../models/freelancer-profile-update.dto";
import { FreelancerProfileQueryDto } from "../models/freelancer-profile-query.dto";
import { PageDto, UserDto } from "../models";

export interface FreelancerService{
    create(userId: string, values: CreateFreelancerProfileDto): Promise<FreelancerProfileDto>;
    
    update(profileId: string, values:UpdateFreelancerProfileDto): Promise<FreelancerProfileDto | null>;
    
    findById(id: string): Promise<FreelancerProfileDto | undefined>;

    findByUserId(userId: string): Promise<FreelancerProfileDto | undefined>;

    findByFreelancerName(freelancerName: string): Promise<FreelancerProfileDto | undefined>;

    find(query: FreelancerProfileQueryDto): Promise<PageDto<FreelancerProfileDto>>;        

    delete(id: string): Promise<boolean>
}

export const FREELANCER_PROFILE_SERVICE = 'FreelancerProfileService';