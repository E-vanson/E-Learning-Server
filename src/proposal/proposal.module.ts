import { FreelancerProfileEntity } from '@/core/entities/freelancer-profile-entity';
import { JobListingEntity } from '@/core/entities/job-listing.entity';
import { JobProposalEntity } from '@/core/entities/job-proposal-entity';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalController } from './controllers/proposal.controller';
import { JOB_PROPOSAL_SERVICE } from '@/core/services/job-proposal.service';
import { TypeormJobProposalService } from './services/typeorm-job-proposal.service';
import { UserEntity } from '@/core/entities/user.entity';
import { EmployerProfileEntity } from '@/core/entities/employer-profile-entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            JobProposalEntity,
            FreelancerProfileEntity,
            JobListingEntity,
            UserEntity,
            EmployerProfileEntity
        ]),
        EventEmitterModule.forRoot()
    ],
    controllers: [ProposalController],
    providers: [
        {
            provide: JOB_PROPOSAL_SERVICE,
            useClass: TypeormJobProposalService
        }
    ],
    exports: [JOB_PROPOSAL_SERVICE]
})
export class ProposalModule {
    
}
