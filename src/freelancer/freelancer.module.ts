import { FreelancerProfileEntity } from '@/core/entities/freelancer-profile-entity';
import { UserEntity } from '@/core/entities/user.entity';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreelancerController } from './controllers/freelancer.controller';
import { FREELANCER_PROFILE_SERVICE } from '@/core/services/freelancer.service';
import { TypeormFreelancerService } from './services/typeorm-freelancer.service';
import { UserModule } from '@/user/user.module';
import { EmployerModule } from '@/employer/employer.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            FreelancerProfileEntity,
            UserEntity
        ]),
        UserModule,
       forwardRef(() => EmployerModule)
    ],
    controllers: [FreelancerController],
    providers: [
        {
            provide: FREELANCER_PROFILE_SERVICE,
            useClass: TypeormFreelancerService
        }
    ],
    exports: [
        FREELANCER_PROFILE_SERVICE,
        TypeOrmModule.forFeature([FreelancerProfileEntity])
    
    ]
})
export class FreelancerModule {}
