import { VerifyEmailDto } from '@/core/models';
import { FirebaseService } from '@/core/security/firebase.service';
import { USER_SERVICE, UserService } from '@/core/services';
import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(
    private firebaseService: FirebaseService,
    @Inject(USER_SERVICE)
    private userService: UserService,
  ) {}

  @Post('verify-email')
  async verifyEmail(@Query('oobCode') oobCode: string) {
    console.log("Inside verify email", oobCode)
    const { uid, emailVerified } =
      await this.firebaseService.verifyEmail(oobCode);

    if (!emailVerified) {
      throw new BadRequestException('Email verification failed.');
    }

    await this.userService.updateEmailVerified(uid, emailVerified);

    return await this.userService.findById(uid);
  }

   @Post('verifing-email')
  async verifingEmail(@Body() verifyEmailDto: VerifyEmailDto) {
  console.log("Verification data:", verifyEmailDto);
  await this.userService.updateEmailVerified(
    verifyEmailDto.id, 
    verifyEmailDto.status
  );
  return this.userService.findById(verifyEmailDto.id);
  }
}
