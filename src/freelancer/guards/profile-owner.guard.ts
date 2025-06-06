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


@Injectable()
export class ProfileOwnerGuard implements CanActivate {
  constructor(
    private security: SecurityContextService,
    @Inject(FREELANCER_PROFILE_SERVICE)
    private profileService: FreelancerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log("Inside the quard...")
    const request = context.switchToHttp().getRequest<Request>();
    const user = this.security.getAuthenticatedUser();

    if (user.isAdminOrOwner()) {
      return true;
    }

    const profileId = request.params['profileId'] || request.body['id'];

    if (!profileId) {
      return false;
    }

    try {
        const profile = await this.profileService.findById(profileId);
            
        return profile?.userId === user.id;
    } catch (error) {
        if (error instanceof NotFoundException) {
        return false;
        }
        throw error;
    }
  }
}