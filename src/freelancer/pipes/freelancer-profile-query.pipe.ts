import { FreelancerProfileQueryDto } from "@/core/models/freelancer-profile-query.dto";
import { SecurityContextService } from "@/core/security/security-context.service";
import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class FreelancerProfileQueryTransformPipe implements PipeTransform<FreelancerProfileQueryDto, FreelancerProfileQueryDto>{
    constructor(private security: SecurityContextService) { }
    
    transform(value: FreelancerProfileQueryDto, metadata: ArgumentMetadata): FreelancerProfileQueryDto{
        const user = this.security.getAuthenticatedUser();
        if (user.isAdminOrOwner()) {
            return value;            
        }
        return value;
    }
}