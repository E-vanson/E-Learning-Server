
import { Roles } from '@/common/decorators';
import { DomainError } from '@/common/errors';
import { UserRole } from '@/core/models';
import { SecurityContextService } from '@/core/security/security-context.service';
import { DASHBOARD_SERVICE, DashboardService } from '@/core/services';
import { EMPLOYER_PROFILE_SERVICE, EmployerProfileService } from '@/core/services/employer-profile.service';
import { JOB_SERVICE, JobService } from '@/core/services/job.service';
import { Controller, Get, Inject, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EmployerProfileQueryTransformPipe } from '../pipes/employer-profile-query.pipe';
import { EmployerProfileQueryDto } from '@/core/models/employer-profile-query.dto';

@ApiTags('Employer-Dashboard')
@Controller('employer/dashboard')
export class DashboardController {
    constructor(
    private security: SecurityContextService,  
      @Inject(EMPLOYER_PROFILE_SERVICE)
      private employerService: EmployerProfileService,
      @Inject(JOB_SERVICE)
      private jobSerivice: JobService
  ) {}

  @Get('summary')
  async getSummary() {
    const user = this.security.getAuthenticatedUser()  
    return await this.employerService.getSummary(user.id);
  }

  @Get('jobs')
  async getJobs(@Query(EmployerProfileQueryTransformPipe) query: EmployerProfileQueryDto) {
    const user = this.security.getAuthenticatedUser();
    const employer = await this.employerService.findByUserId(user.id);
    if (!employer) throw new DomainError("You're not authorised here");
    const employerId = employer.id;

    const jobs = await this.jobSerivice.findByEmployerIdAndQuery(employerId, query);
    return jobs;
  }

//   @Get('enrollments/:year')
//   async getMonthlyEnrollments(@Param('year', ParseIntPipe) year: number) {
//     return await this.dashboardService.getMonthlyEnrollments(year);
//   }
}