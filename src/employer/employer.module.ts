import { EmployerProfileEntity } from '@/core/entities/employer-profile-entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployerProfileController } from './controllers/employer-profile.controller';
import { EMPLOYER_PROFILE_SERVICE } from '@/core/services/employer-profile.service';
import { TypeormEmployerProfileService } from './services/typeorm-employer-profile.service';
import { UserEntity } from '@/core/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            EmployerProfileEntity,
            UserEntity
        ]),
    ],
    controllers: [EmployerProfileController],
    providers: [
        {
            provide: EMPLOYER_PROFILE_SERVICE,
            useClass: TypeormEmployerProfileService
        }
    ]
})
export class EmployerModule {}
