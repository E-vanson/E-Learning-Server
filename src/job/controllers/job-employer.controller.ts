
import { JobListingUpdateDto } from "@/core/models/job-listing-update.dto";
import { SecurityContextService } from "@/core/security/security-context.service";
import { JOB_SERVICE, JobService } from "@/core/services/job.service";
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Inject, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JobOwnerGuard } from "../guards/job.guard";
import { ApiOkResponsePaginated } from "@/common/decorators";
import { JobListingDto } from "@/core/models/job-listing.dto";
import { JobListingQueryDto } from "@/core/models/job-listing-query.dto";
import { JobQueryTransformPipe } from "../pipes/job-query.pipe";
import { Employer } from "@/common/decorators/employer.decorator";
import { JobListingCreateDto } from "@/core/models/job-listing-create.dto";



@ApiTags('Job')
@ApiBearerAuth()
@Controller('/employer/jobs')
@Employer()
export class JobEmployerController {
    constructor(
        private security: SecurityContextService,
        @Inject(JOB_SERVICE)
        private jobService: JobService
    ) { }
    
    @Post()
    @ApiOperation({ summary: 'Create a job' })
    @ApiBody({ type: JobListingCreateDto })
    @ApiResponse({
        status: 201,
        description: 'Job created successfully'
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized'
    })
    async create(@Body() values: JobListingCreateDto) {
        console.log("inside the controller");
        const user = this.security.getAuthenticatedUser();
        const jobId = await this.jobService.create(user.id, values)
        console.log("The jobid: ", jobId);
        return jobId;
    }

    @Put(':id')
    @UseGuards(JobOwnerGuard)
    async updateJob(
        @Param('id') jobId: string,
        @Body() values: Partial<JobListingUpdateDto>,
    ) {
        try {
            const user = this.security.getAuthenticatedUser();
            const updatedJob = await this.jobService.update(user.id, jobId, values);
            return { success: true, data: updatedJob }; 
        } catch (error) {
            throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: error.message,
            }, HttpStatus.BAD_REQUEST);
  }
    }

    @Get(':id')
    @UseGuards(JobOwnerGuard)
    async getJob(
        @Param('id') jobId: string
    ) {
        return await this.jobService.findById(jobId);
    }

    @ApiOkResponsePaginated(JobListingDto)
    @Get()
    async find(@Query(JobQueryTransformPipe) query: JobListingQueryDto) {
        return await this.jobService.find(query);
    }

    @UseGuards(JobOwnerGuard)
    @Delete(':id')
    async delete(@Param('id') id: string) {
        await this.jobService.delete(id);
    }
}