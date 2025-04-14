import { PageDto } from "../models";
import { JobListingCreateDto } from "../models/job-listing-create.dto"
import { JobListingQueryDto } from "../models/job-listing-query.dto";
import { JobListingUpdateDto } from "../models/job-listing-update.dto"
import { JobListingDto } from "../models/job-listing.dto"


export interface JobService {    
    create(userId: string, values: JobListingCreateDto): Promise<string>;

    update(userId: string, jobId: string,values: Partial<JobListingUpdateDto>): Promise<void>;

    findById(id: string): Promise<JobListingDto | undefined>;

    findByEmployerId(employerId: string): Promise<JobListingDto[] | undefined>;

    findBySlug(slug: string): Promise<JobListingDto | undefined>;

    find(query: JobListingQueryDto): Promise<PageDto<JobListingDto>>

    isJobOwner(userId: string, jobId: string): Promise<boolean>;
    
    delete(id: string): Promise<void>;

    findByEmployerIdAndQuery(employerId: string, query: JobListingQueryDto): Promise<PageDto<JobListingDto>>
}

export const JOB_SERVICE = 'JobService';