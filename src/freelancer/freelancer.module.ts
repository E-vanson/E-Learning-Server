import { FreelancerProfileEntity } from '@/core/entities/freelancer-profile-entity';
import { UserEntity } from '@/core/entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreelancerController } from './controllers/freelancer.controller';
import { FREELANCER_PROFILE_SERVICE } from '@/core/services/freelancer.service';
import { TypeormFreelancerService } from './services/typeorm-freelancer.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            FreelancerProfileEntity,
            UserEntity
        ]),
    ],
    controllers: [FreelancerController],
    providers: [
        {
            provide: FREELANCER_PROFILE_SERVICE,
            useClass: TypeormFreelancerService
        }
    ]
})
export class FreelancerModule {}
