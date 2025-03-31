import { EmployerProfileQueryDto } from "@/core/models/employer-profile-query.dto";
import { SecurityContextService } from "@/core/security/security-context.service";
import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class EmployerProfileQueryTransformPipe implements PipeTransform<EmployerProfileQueryDto, EmployerProfileQueryDto>{
    constructor(private security: SecurityContextService) { }
    
    transform(value: EmployerProfileQueryDto, metadata: ArgumentMetadata): EmployerProfileQueryDto{
        const user = this.security.getAuthenticatedUser();
        if (user.isAdminOrOwner()) {
            return value;            
        }
        return value;
    }
}