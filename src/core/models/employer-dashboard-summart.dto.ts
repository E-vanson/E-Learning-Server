import { JobListingDto } from "./job-listing.dto";

export class EmployerDashboardSummarDto{
    jobCount: number;
    applicationCount: number;
    reviewCount: number;
    contractCount: number;
    jobs: JobListingDto[];

    constructor(partial: Partial<EmployerDashboardSummarDto> = {}) {
        Object.assign(this, partial);
      }
}