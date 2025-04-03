import { SecurityContextService } from "@/core/security/security-context.service";
import { JOB_PROPOSAL_SERVICE, ProposalService } from "@/core/services/job-proposal.service";
import { JOB_SERVICE, JobService } from "@/core/services/job.service";
import { CanActivate, ExecutionContext, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Request } from 'express';


@Injectable()
export class ProposalJobOwnerGuard implements CanActivate{
    constructor(
        private security: SecurityContextService,
        @Inject(JOB_PROPOSAL_SERVICE)
        private proposalService: ProposalService
    ) { }
    
    async canActivate(context: ExecutionContext): Promise<boolean> {        
        const request = context.switchToHttp().getRequest<Request>();
        const user = this.security.getAuthenticatedUser();
            
        if (user.isAdminOrOwner()) {
            return true;
        }       

        const proposalId = request.params['id']       
        if (!proposalId) {
        return false;
        }        

        try {            
            const isOwner = await this.proposalService.isProposalJobOwner(user.id, proposalId)            
            return isOwner
        } catch (error) {
            if (error instanceof NotFoundException) {                
                return false;                
            }
            
            throw error;
        }
     }
}