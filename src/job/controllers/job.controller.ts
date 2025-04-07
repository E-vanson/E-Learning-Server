import { JobListingCreateDto } from "@/core/models/job-listing-create.dto";
import { JobListingUpdateDto } from "@/core/models/job-listing-update.dto";
import { SecurityContextService } from "@/core/security/security-context.service";
import { JOB_SERVICE, JobService } from "@/core/services/job.service";
import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JobOwnerGuard } from "../guards/job.guard";
import { ApiOkResponsePaginated } from "@/common/decorators";
import { JobListingDto, JobStatus } from "@/core/models/job-listing.dto";
import { JobListingQueryDto } from "@/core/models/job-listing-query.dto";
import { JobQueryTransformPipe } from "../pipes/job-query.pipe";



@ApiTags('Job')
@Controller('/content/jobs')  
export class JobController{
    constructor(
        private security: SecurityContextService,
        @Inject(JOB_SERVICE)
        private jobService: JobService
    ) { }

    @Get(':slug')
    // @UseGuards(JobOwnerGuard)
    async getJobBySlug(
        @Param('slug') slug: string
    ) {
        console.log("Inside the job content slug controller:     ")
        return await this.jobService.findBySlug(slug);
    }
        
    @Get(':id')
    // @UseGuards(JobOwnerGuard)
    async getJob(
        @Param('id') jobId: string
    ) {
        console.log("Inside the job content controller:     ")
        return await this.jobService.findById(jobId);
    }

    


    @ApiOkResponsePaginated(JobListingDto)
    @Get()
    async find(@Query() query: JobListingQueryDto) {
        console.log("Inside the jobs content controller:     ")
        return await this.jobService.find({
            ...query,
            status: JobStatus.ACTIVE,
            orderBy: query.orderBy ?? 'publishedAt'
        });
    }

    // @UseGuards(JobOwnerGuard)
    // @Delete(':id')
    // async delete(@Param('id') id: string) {
    //     await this.jobService.delete(id);
    // }
}