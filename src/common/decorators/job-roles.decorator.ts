import { UserJobRole } from '@/core/models';
import { SetMetadata } from '@nestjs/common';

export const JOB_ROLES_KEY = 'job_roles';
export const Job_Roles = (...roles: UserJobRole[]) => SetMetadata(JOB_ROLES_KEY, roles);
