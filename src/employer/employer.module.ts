import { EmployerProfileEntity } from '@/core/entities/employer-profile-entity';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployerProfileController } from './controllers/employer-profile.controller';
import { EMPLOYER_PROFILE_SERVICE } from '@/core/services/employer-profile.service';
import { TypeormEmployerProfileService } from './services/typeorm-employer-profile.service';
import { UserEntity } from '@/core/entities/user.entity';
import { UserModule } from '@/user/user.module';
import { FreelancerModule } from '@/freelancer/freelancer.module';
import { JobProposalEntity } from '@/core/entities/job-proposal-entity';
import { ProposalModule } from '@/proposal/proposal.module';
import { DashboardController } from './controllers/employer-dashboard-controller';
import { JobModule } from '@/job/job.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            EmployerProfileEntity,
            UserEntity,
            JobProposalEntity
        ]),
        UserModule,        
        forwardRef(() => FreelancerModule),
        ProposalModule,
        JobModule
    ],
    controllers: [EmployerProfileController, DashboardController],
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
