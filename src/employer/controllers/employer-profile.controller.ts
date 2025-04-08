import { CreateEmployerProfileDto } from "@/core/models/employer-profile-create.dto";
import { EmployerProfileUpdateDto } from "@/core/models/employer-profile-update.dto";
import { SecurityContextService } from "@/core/security/security-context.service";
import { EMPLOYER_PROFILE_SERVICE, EmployerProfileService } from "@/core/services/employer-profile.service";
import { Body, Controller, Delete, Get, HttpStatus, Inject, Param, ParseIntPipe, Post, Put, Query, Res, SerializeOptions, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from 'express';
import { EmployerProfileOwnerGuard } from "../guards/employer-profile.guard";
import { ApiOkResponsePaginated } from "@/common/decorators";
import { EmployerProfileDto } from "@/core/models/employer-profie.dto";
import { EmployerProfileQueryTransformPipe } from "../pipes/employer-profile-query.pipe";
import { EmployerProfileQueryDto } from "@/core/models/employer-profile-query.dto";


@ApiTags('EmployerProfile')
@ApiBearerAuth()
@Controller('employer')    
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
        description: 'Freelancer profile created successfully' 
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

    @Put(':id')
    @UseGuards(EmployerProfileOwnerGuard)
    async updateProfile(
        @Param('id') profileId: string,
        @Body() values:EmployerProfileUpdateDto,
    ) {
      return await this.employerProfileService.update(profileId, values)
    }
    
    
    // @UseGuards(EmployerProfileOwnerGuard)
    @Get('profile/:id')
    async getEmployerProfile(
    @Param('id') id: string,
    @Res({ passthrough: true }) resp: Response, // Injects the Response object to control the HTTP response.
    ) {
        console.log("Getting the employer....")
        const result = await this.employerProfileService.findById(id);
        if (!result) {
            resp.status(HttpStatus.NO_CONTENT);
        }    
        return result;
    }
    
    @UseGuards(EmployerProfileOwnerGuard)
    @Delete(':id')
    async delete(@Param('id') id: string) {
    await this.employerProfileService.delete(id);
    }

     @SerializeOptions({
         groups: ['detail'],
     })
     @Get(':companyName')
     async getProfileByCompanyName(
         @Param('companyName') companyName: string,
         @Res({ passthrough: true }) resp: Response,
     ) {
         const result = await this.employerProfileService.findByCompanyName(companyName);
         if (!result) {
             resp.status(HttpStatus.NO_CONTENT);
             return undefined;
         }
         return result;
     }

    @ApiOkResponsePaginated(EmployerProfileDto)
    @Get()
    async find(@Query(EmployerProfileQueryTransformPipe) query: EmployerProfileQueryDto) {
        return await this.employerProfileService.find(query);
    }
    
}