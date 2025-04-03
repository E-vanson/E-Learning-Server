import { JobListingQueryDto } from "@/core/models/job-listing-query.dto";
import { JobProposalQueryDto } from "@/core/models/job-proposal-query.dto";
import { SecurityContextService } from "@/core/security/security-context.service";
import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";



@Injectable()
export class ProposalQueryTransformPipe implements PipeTransform<JobProposalQueryDto, JobProposalQueryDto>{
    constructor(private security: SecurityContextService) { }
    
    transform(value: JobProposalQueryDto, metadata: ArgumentMetadata): JobProposalQueryDto{
        const user = this.security.getAuthenticatedUser();
        if (user.isAdminOrOwner()) {
            return value;            
        }
        return value;
    }
}