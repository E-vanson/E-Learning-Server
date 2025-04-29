import { SecurityContextService } from "@/core/security/security-context.service";
import { FREELANCER_PROFILE_SERVICE, FreelancerService } from "@/core/services/freelancer.service";
import { JOB_PROPOSAL_SERVICE, ProposalService } from "@/core/services/job-proposal.service";
import { Controller, Get, Inject, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FreelancerProfileQueryTransformPipe } from "../pipes/freelancer-profile-query.pipe";
import { FreelancerProfileQueryDto } from "@/core/models/freelancer-profile-query.dto";
import { DomainError } from "@/common/errors";



@ApiTags('Freelancer-Dashboard')
@Controller('freelancer/dashboard')
export class DashboardController {
    constructor(
        private security: SecurityContextService,
        @Inject(FREELANCER_PROFILE_SERVICE)
        private freelancerService: FreelancerService,
        @Inject(JOB_PROPOSAL_SERVICE)
        private proposalService: ProposalService        
    ) { }
    
    @Get('summary')
    async getSummary() {
        const user = this.security.getAuthenticatedUser()
        return await this.freelancerService.getDashboardSummary(user.id);
    }

    @Get('proposals')
    async getProposals(@Query(FreelancerProfileQueryTransformPipe) query: FreelancerProfileQueryDto) {
        const user = this.security.getAuthenticatedUser();
        const freelancer = await this.freelancerService.findByUserId(user.id);
        if (!freelancer) throw new DomainError("You're not authorised here");
        const freelancerId = freelancer.id;

        const proposals = await this.proposalService.findByFreelancerIdAndQuery(freelancerId, query)
        return proposals;
    }
}