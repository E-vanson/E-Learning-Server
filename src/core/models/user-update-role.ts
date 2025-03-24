import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from './user.dto';

export class UserUpdateRoleDto {
  @ApiProperty({
    description: 'The new role to assign to the user',
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  role: UserRole;
}