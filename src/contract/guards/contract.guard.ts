import { SecurityContextService } from '@/core/security/security-context.service';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { FREELANCER_PROFILE_SERVICE, FreelancerService } from '@/core/services/freelancer.service';
import { CONTRACT_SERVICE, ContractService } from '@/core/services/contract.service';


@Injectable()
export class ContractOwnerGuard implements CanActivate {
  constructor(
    private security: SecurityContextService,
    @Inject(CONTRACT_SERVICE)
    private contractService: ContractService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = this.security.getAuthenticatedUser();
    console.log("top of the guard: ");  
    if (user.isAdminOrOwner()) {
      return true;
    }

    const contractId = request.params['id'] || request.body['id'];
    console.log("contract inside the guard: ", contractId);  
    if (!contractId) {
      return false;
    }

    try {
        const isOwner = await this.contractService.isContractOwner(user.id, contractId);
        console.log("inside the guard: ", isOwner);    
        return isOwner;
    } catch (error) {
        if (error instanceof NotFoundException) {
        return false;
        }
        throw error;
    }
  }
}