import { ApiOkResponsePaginated, Public, Roles } from '@/common/decorators';
import { UserDto,UserQueryDto, UserRole } from '@/core/models';
import { USER_SERVICE, UserService } from '@/core/services';
import { UserUpdateRoleDto } from '@/core/models/user-update-role';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseEnumPipe,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { UserUpdateJobRoleDto } from '@/core/models/user-update-job-role.dto';

@ApiTags('User')
@Controller('/admin/users')
@Roles(UserRole.OWNER, UserRole.ADMIN)
export class UserAdminController {
  constructor(@Inject(USER_SERVICE) private userService: UserService) {}

  @ApiOkResponsePaginated(UserDto)
  @Get()
  async find(@Query() query: UserQueryDto) {
    return await this.userService.find(query);
  }

  @ApiBody({ type: UserUpdateRoleDto })
  @Put(':id/role')
  async updateRole(
    @Param('id') userId: string,
    @Body() userUpdateRoleDto: UserUpdateRoleDto,
  ) {
    const { role } = userUpdateRoleDto;
    if (role === UserRole.OWNER) {
      throw new BadRequestException('Owner role grant is forbidden');
    }
    await this.userService.updateRole(userId, role);
  }

  @ApiBody({ type: UserUpdateJobRoleDto })
  @Put(':id/job-role')
  async updateJobRole(
    @Param('id') userId: string,
    @Body() userUpdateJobRoleDto: UserUpdateJobRoleDto,
  ) {    
    await this.userService.updateJobRole(userId, userUpdateJobRoleDto.jobRole);
  }
}
