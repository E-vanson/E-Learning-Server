import { UserModule } from '@/user/user.module';
import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { NextFunction, Request, Response } from 'express';
import { BlogModule } from './blog/blog.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { CoreModule } from './core/core.module';
import { CourseModule } from './course/course.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { ReviewModule } from './review/review.module';
import { SettingModule } from './setting/setting.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule, ServeStaticModuleOptions } from '@nestjs/serve-static';
import { ConfigService } from '@nestjs/config';   
import { join } from 'path';
import { EmployerModule } from './employer/employer.module';
import { FreelancerModule } from './freelancer/freelancer.module';
import { JobModule } from './job/job.module';
import { ProposalModule } from './proposal/proposal.module';
import { ProposalReviewModule } from './proposal-review/proposal-review.module';


function logger(req: Request, res: Response, next: NextFunction) {
  const { method, originalUrl } = req;
  console.log(method, originalUrl);
  next();
}

@Module({
  imports: [
   ServeStaticModule.forRootAsync({
      inject: [ConfigService], // Inject ConfigService to access IMAGE_PATH
      useFactory: (configService: ConfigService): ServeStaticModuleOptions[] => {
        const basePath = configService.get<string>('IMAGE_PATH') ?? 'uploads';
        const uploadsPath = join(basePath); // Convert to absolute path if needed
        
        console.log('Serving static files from:', uploadsPath); // Debug
        
        return [{
          rootPath: uploadsPath, // Same base path as Multer
          serveRoot: '/uploads', // URL prefix (e.g., /uploads/2025/03/file.png)
          serveStaticOptions: {
            index: false, // Disable directory indexing (security)
          },
        }];
      },
    }),    
    CoreModule,
    UserModule,
    BlogModule,
    CourseModule,
    DashboardModule,
    EnrollmentModule,
    BookmarkModule,
    ReviewModule,
    SettingModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    EmployerModule,
    FreelancerModule,
    JobModule,
    ProposalModule,
    ProposalReviewModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(logger).forRoutes({ path: '*path', method: RequestMethod.ALL });  
  }
}
