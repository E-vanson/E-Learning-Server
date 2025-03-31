import {
  PageDto,
  UserCreateDto,
  UserDto,
  UserJobRole,
  UserQueryDto,
  UserRole,
  UserUpdateDto,
} from '../models';

export interface UserService {
  create(values: UserCreateDto): Promise<UserDto>;

  update(values: UserUpdateDto): Promise<void>;

  updateRole(userId: string, role: UserRole): Promise<void>;

  updateJobRole(userId: string, role: UserJobRole): Promise<void>;

  updateImage(userId: string, image: string): Promise<void>;

  updateEmailVerified(userId: string, emailVerified: boolean): Promise<void>;

  findById(id: string): Promise<UserDto | undefined>;

  findByUsername(username: string): Promise<UserDto | undefined>;

  find(query: UserQueryDto): Promise<PageDto<UserDto>>;
}

export const USER_SERVICE = 'UserService';
