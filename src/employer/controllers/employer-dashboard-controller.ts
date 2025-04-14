
import { Roles } from '@/common/decorators';
import { UserRole } from '@/core/models';
import { SecurityContextService } from '@/core/security/security-context.service';
import { DASHBOARD_SERVICE, DashboardService } from '@/core/services';
import { EMPLOYER_PROFILE_SERVICE, EmployerProfileService } from '@/core/services/employer-profile.service';
import { Controller, Get, Inject, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Employer-Dashboard')
@Controller('employer/dashboard')
export class DashboardController {
    constructor(
    private security: SecurityContextService,  
    @Inject(EMPLOYER_PROFILE_SERVICE) private employerService: EmployerProfileService,
  ) {}

  @Get('summary')
  async getSummary() {
    const user = this.security.getAuthenticatedUser()  
    return await this.employerService.getSummary(user.id);
  }

//   @Get('enrollments/:year')
//   async getMonthlyEnrollments(@Param('year', ParseIntPipe) year: number) {
//     return await this.dashboardService.getMonthlyEnrollments(year);
//   }
}