import { ApiProperty } from '@nestjs/swagger';
import { UserJobRole } from './user.dto';

export class UserUpdateJobRoleDto {
  @ApiProperty({
    description: 'The new role to assign to the user',
    enum: UserJobRole,
    example: UserJobRole.FREELANCER,
  })
  jobRole: UserJobRole;
}