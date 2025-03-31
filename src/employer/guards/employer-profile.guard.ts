import { SecurityContextService } from '@/core/security/security-context.service';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import {EMPLOYER_PROFILE_SERVICE, EmployerProfileService } from '@/core/services/employer-profile.service';


@Injectable()
export class EmployerProfileOwnerGuard implements CanActivate {
  constructor(
    private security: SecurityContextService,
    @Inject(EMPLOYER_PROFILE_SERVICE)
    private profileService: EmployerProfileService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = this.security.getAuthenticatedUser();

    if (user.isAdminOrOwner()) {
      return true;
    }

    const profileId = request.params['id'] || request.body['id'];

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