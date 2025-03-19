import { UserDto } from '@/core/models/user.dto';

// defines a security context that holds the authenticated user
export class SecurityContext {
  user?: UserDto;
}
