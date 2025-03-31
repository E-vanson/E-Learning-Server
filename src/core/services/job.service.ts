import { PageDto } from "../models";
import { JobListingCreateDto } from "../models/job-listing-create.dto"
import { JobListingQueryDto } from "../models/job-listing-query.dto";
import { JobListingUpdateDto } from "../models/job-listing-update.dto"
import { JobListingDto } from "../models/job-listing.dto"


export interface JobService {
    create(values: JobListingCreateDto): Promise<JobListingDto>;

    update(values: JobListingUpdateDto): Promise<void>;

    findById(id: string): Promise<JobListingDto | undefined>;

    findByTitle(title: string): Promise<JobListingDto | undefined>;

    find(query: JobListingQueryDto): Promise<PageDto<JobListingDto>>

}