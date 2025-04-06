import { CourseEntity } from '@/core/entities/course.entity';
import { EnrolledCourseEntity } from '@/core/entities/enrolled-course.entity';
import { PostEntity } from '@/core/entities/post.entity';
import { UserEntity } from '@/core/entities/user.entity';
import { DASHBOARD_SERVICE } from '@/core/services';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { TypeormDashboardService } from './typeorm-dashboard.service';
import { JobListingEntity } from '@/core/entities/job-listing.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CourseEntity,
      PostEntity,
      UserEntity,
      EnrolledCourseEntity,
      JobListingEntity
    ]),
  ],
  controllers: [DashboardController],
  providers: [
    {
      provide: DASHBOARD_SERVICE,
      useClass: TypeormDashboardService,
    },
  ],
})
export class DashboardModule {}
