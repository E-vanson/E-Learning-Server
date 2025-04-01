import { JobListingCreateDto } from "@/core/models/job-listing-create.dto";
import { JobListingUpdateDto } from "@/core/models/job-listing-update.dto";
import { SecurityContextService } from "@/core/security/security-context.service";
import { JOB_SERVICE, JobService } from "@/core/services/job.service";
import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JobOwnerGuard } from "../guards/job.guard";
import { ApiOkResponsePaginated } from "@/common/decorators";
import { JobListingDto } from "@/core/models/job-listing.dto";
import { JobListingQueryDto } from "@/core/models/job-listing-query.dto";
import { JobQueryTransformPipe } from "../pipes/job-query.pipe";



@ApiTags('Job')
@ApiBearerAuth()
@Controller('job')  
export class JobController{
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
        await this.jobService.create(user.id, values)
    }

    @Put(':id')
    @UseGuards(JobOwnerGuard)
    async updateJob(
        @Param('id') jobId: string,
        @Body() values:Partial<JobListingUpdateDto>,
    ) {
        const user = this.security.getAuthenticatedUser();
        return await this.jobService.update(user.id,jobId, values)
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