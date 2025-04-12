import { DomainError } from '@/common/errors';
import { EmployerProfileUpdateDto } from '@/core/models/employer-profile-update.dto';
import { SecurityContextService } from '@/core/security/security-context.service';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class CourseUpdateTransformPipe
  implements PipeTransform<EmployerProfileUpdateDto, EmployerProfileUpdateDto>
{
  constructor(private security: SecurityContextService) {}

  transform(
    value: EmployerProfileUpdateDto,
    metadata: ArgumentMetadata,
  ): EmployerProfileUpdateDto {
    const user = this.security.getAuthenticatedUser();
    value.updatedBy = user.id;
    if (!user) {
      throw new DomainError("You're not authorised here");
    }    
    return value;
  }
}
