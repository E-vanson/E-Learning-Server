import { EmployerProfileEntity } from '@/core/entities/employer-profile-entity';
import { JobContractEntity } from '@/core/entities/contract.entity';
import { UserEntity } from '@/core/entities/user.entity';
import { CONTRACT_SERVICE } from '@/core/services/contract.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormContractService } from './services/typeorm-contract.service';
import { ContractController } from './controllers/contract.controller';
import { JobListingEntity } from '@/core/entities/job-listing.entity';
import { FreelancerProfileEntity } from '@/core/entities/freelancer-profile-entity';
import { FREELANCER_PROFILE_SERVICE } from '@/core/services/freelancer.service';
import { EmployerModule } from '@/employer/employer.module';
import { FreelancerModule } from '@/freelancer/freelancer.module';
import { UserModule } from '@/user/user.module';
import { JobModule } from '@/job/job.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            EmployerProfileEntity,
            JobContractEntity,
            UserEntity,
            JobListingEntity,
            FreelancerProfileEntity,
            
        ]),
        EmployerModule,
        FreelancerModule,
        UserModule,
        JobModule
    ],
    controllers: [ContractController],
    providers: [
        {
            provide: CONTRACT_SERVICE,
            useClass: TypeormContractService
        }
    ],

})
export class ContractModule {}
