import { SecurityContextService } from "@/core/security/security-context.service";
import { JOB_SERVICE, JobService } from "@/core/services/job.service";
import { CanActivate, ExecutionContext, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Request } from 'express';


@Injectable()
export class JobOwnerGuard implements CanActivate{
    constructor(
        private security: SecurityContextService,
        @Inject(JOB_SERVICE)
        private jobService: JobService
    ) { }
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        console.log("Inside the job guard...")
        const request = context.switchToHttp().getRequest<Request>();
        const user = this.security.getAuthenticatedUser();
            
        if (user.isAdminOrOwner()) {
            return true;
        }       

        const jobId = request.params['id']       
        if (!jobId) {
        return false;
        }        

        try {            
            const isOwner = await this.jobService.isJobOwner(user.id, jobId)            
            return isOwner
        } catch (error) {
            if (error instanceof NotFoundException) {                
                return false;                
            }
            
            throw error;
        }
     }
}