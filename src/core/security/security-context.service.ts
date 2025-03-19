import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { SecurityContext } from './security-context.domain';

// Stores user authentication details in AsyncLocalStorage
@Injectable()
export class SecurityContextService {
  constructor(private als: AsyncLocalStorage<SecurityContext>) {}
  getAuthenticatedUser() { //fetches current authenticated user
    const user = this.als.getStore()?.user;
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  getAuthenticatedUserOpt() {
    return this.als.getStore()?.user;
  }
}
