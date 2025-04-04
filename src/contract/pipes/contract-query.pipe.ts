import { ContractQueryDto } from "@/core/models/contract-query.dto";
import { FreelancerProfileQueryDto } from "@/core/models/freelancer-profile-query.dto";
import { SecurityContextService } from "@/core/security/security-context.service";
import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ContractQueryTransformPipe implements PipeTransform<ContractQueryDto, ContractQueryDto>{
    constructor(private security: SecurityContextService) { }
    
    transform(value: ContractQueryDto, metadata: ArgumentMetadata): ContractQueryDto{
        const user = this.security.getAuthenticatedUser();
        if (user.isAdminOrOwner()) {
            return value;            
        }
        return value;
    }
}