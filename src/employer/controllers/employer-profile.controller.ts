import { CreateEmployerProfileDto } from "@/core/models/employer-profile-create.dto";
import { SecurityContextService } from "@/core/security/security-context.service";
import { EMPLOYER_PROFILE_SERVICE, EmployerProfileService } from "@/core/services/employer-profile.service";
import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";


@ApiTags('EmployerProfile')
@ApiBearerAuth()
@Controller('employer-controller')    
export class EmployerProfileController{
    constructor(
        private security: SecurityContextService,
        @Inject(EMPLOYER_PROFILE_SERVICE)
        private employerProfileService: EmployerProfileService,        
    ) { }
    
    @Post()
    @ApiOperation({ summary: 'Create employer profile' })
    @ApiResponse({ 
        status: 201, 
        description: 'Employer profile created successfully' 
    })
    @ApiResponse({ 
        status: 401, 
        description: 'Unauthorized' 
    })
    @ApiResponse({ 
        status: 409, 
        description: 'Profile already exists' 
    })
    async create(@Body() values: CreateEmployerProfileDto) {        
        const user = this.security.getAuthenticatedUser();        
        await this.employerProfileService.create(user.id, values)
    }
}