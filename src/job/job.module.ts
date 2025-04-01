import { EmployerProfileEntity } from '@/core/entities/employer-profile-entity';
import { JobListingEntity } from '@/core/entities/job-listing.entity';
import { UserEntity } from '@/core/entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobController } from './controllers/job.controller';
import { JOB_SERVICE } from '@/core/services/job.service';
import { TypeormJobService } from './service/typeorm-job.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            JobListingEntity,
            UserEntity,
            EmployerProfileEntity
        ]),
        EventEmitterModule.forRoot(),
    ],
    
    controllers: [JobController],
    providers: [
        {
            provide: JOB_SERVICE,
            useClass: TypeormJobService
        }
    ],
    exports:[JOB_SERVICE]
})
export class JobModule {}
