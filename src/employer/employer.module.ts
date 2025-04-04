import { EmployerProfileEntity } from '@/core/entities/employer-profile-entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployerProfileController } from './controllers/employer-profile.controller';
import { EMPLOYER_PROFILE_SERVICE } from '@/core/services/employer-profile.service';
import { TypeormEmployerProfileService } from './services/typeorm-employer-profile.service';
import { UserEntity } from '@/core/entities/user.entity';
import { UserModule } from '@/user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            EmployerProfileEntity,
            UserEntity
        ]),
        UserModule
    ],
    controllers: [EmployerProfileController],
    providers: [
        {
            provide: EMPLOYER_PROFILE_SERVICE,
            useClass: TypeormEmployerProfileService
        }
    ],
    exports: [EMPLOYER_PROFILE_SERVICE]
})
export class EmployerModule {}
