import { JobListingQueryDto } from "@/core/models/job-listing-query.dto";
import { SecurityContextService } from "@/core/security/security-context.service";
import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";



@Injectable()
export class JobQueryTransformPipe implements PipeTransform<JobListingQueryDto, JobListingQueryDto>{
    constructor(private security: SecurityContextService) { }
    
    transform(value: JobListingQueryDto, metadata: ArgumentMetadata): JobListingQueryDto{
        const user = this.security.getAuthenticatedUser();
        if (user.isAdminOrOwner()) {
            return value;            
        }
        return value;
    }
}