import { CreateJobProposalDto } from "@/core/models/job-proposal-create.dto";
import { UpdateJobProposalDto } from "@/core/models/job-proposal-update.dto";
import { SecurityContextService } from "@/core/security/security-context.service";
import { JOB_PROPOSAL_SERVICE, ProposalService } from "@/core/services/job-proposal.service";
import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ProposalOwnerGuard } from "../guards/proposal-owner.guard";
import { ApiOkResponsePaginated } from "@/common/decorators";
import { JobProposalDto } from "@/core/models/job-proposal.dto";
import { JobProposalQueryDto } from "@/core/models/job-proposal-query.dto";
import { ProposalQueryTransformPipe } from "../pipes/proposal-query.pipe";


@ApiTags('Job-Proposal')
@ApiBearerAuth()
@Controller('proposal')
export class ProposalController{
    constructor(
        private security: SecurityContextService,
        @Inject(JOB_PROPOSAL_SERVICE)
        private proposalSerive: ProposalService
    ){}

    @Post(':id')
    @ApiOperation({ summary: 'Create a job-proposal' })
    @ApiBody({ type: CreateJobProposalDto })    
    @ApiResponse({ 
        status: 201, 
        description: 'Job-Proposal created successfully' 
    })
    @ApiResponse({ 
        status: 401, 
        description: 'Unauthorized' 
    })    
    async create(
        @Param('id') jobId: string,
        @Body() values: Partial<CreateJobProposalDto>) {                
        const user = this.security.getAuthenticatedUser();        
        await this.proposalSerive.create(user.id, jobId,  values)
    }

    @Put(':id')
    @UseGuards(ProposalOwnerGuard)
    @ApiOperation({ summary: 'Update a job proposal' })
    @ApiBody({
    type: UpdateJobProposalDto,
    description: 'Proposal update data',
    })
    async updateProposal(
    @Param('id') proposalId: string,
    @Body() values: UpdateJobProposalDto,
    ) {
    const user = this.security.getAuthenticatedUser();
    return await this.proposalSerive.update(user.id, proposalId, values);
    }

    @Get(':id')
    @UseGuards(ProposalOwnerGuard)
    async getProposal(
        @Param('id') proposalId: string
    ) {
        return await this.proposalSerive.findById(proposalId);
    }

    @ApiOkResponsePaginated(JobProposalDto)
    @Get()
    async find(@Query(ProposalQueryTransformPipe) query: JobProposalQueryDto) {
        return await this.proposalSerive.find(query);
    }

    @UseGuards(ProposalOwnerGuard)
    @Delete(':id')
    async delete(@Param('id') id: string) {
        await this.proposalSerive.delete(id);
    }
}