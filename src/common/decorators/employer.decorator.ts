import { UserJobRole, UserRole } from '@/core/models';
import { applyDecorators } from '@nestjs/common';
import { Job_Roles } from './job-roles.decorator';
import { Roles } from './roles.decorator';


export const Employer = () =>
  applyDecorators(
    Roles(
    UserRole.ADMIN,
    UserRole.OWNER 
    ),
    Job_Roles(
      UserJobRole.EMPLOYER  
    ),
  );
