import { EmployerProfileEntity } from '@/core/entities/employer-profile-entity';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployerProfileController } from './controllers/employer-profile.controller';
import { EMPLOYER_PROFILE_SERVICE } from '@/core/services/employer-profile.service';
import { TypeormEmployerProfileService } from './services/typeorm-employer-profile.service';
import { UserEntity } from '@/core/entities/user.entity';
import { UserModule } from '@/user/user.module';
import { FreelancerModule } from '@/freelancer/freelancer.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            EmployerProfileEntity,
            UserEntity
        ]),
        UserModule,        
        forwardRef(() => FreelancerModule)
    ],
    controllers: [EmployerProfileController],
    providers: [
        {
            provide: EMPLOYER_PROFILE_SERVICE,
            useClass: TypeormEmployerProfileService
        }
    ],
    exports: [
        EMPLOYER_PROFILE_SERVICE,
        TypeOrmModule.forFeature([EmployerProfileEntity]) 
    ]
})
export class EmployerModule {}
