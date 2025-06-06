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
        console.log("Inside the create employer controller: ", values)
        const user = this.security.getAuthenticatedUser();        
        const result = await this.employerProfileService.create(user.id, values)
        return new Response(JSON.stringify(result), {
            status: 201,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    @Put(':profileId')
    @UseGuards(EmployerProfileOwnerGuard)
    async updateProfile(
        @Param('profileId') profileId: string,
        @Body() values:EmployerProfileUpdateDto,
    ) {
      return await this.employerProfileService.update(profileId, values)
    }

    @Get('profile/:userId')
    async getEmployerProfileByUserId(
    @Param('userId') id: string,
    @Res({ passthrough: true }) resp: Response, // Injects the Response object to control the HTTP response.
    ) {
        console.log("Getting the employer....")
        const result = await this.employerProfileService.findByUserId(id);
        if (!result) {
            resp.status(HttpStatus.NO_CONTENT);
        }    
        return result;
    }
    
    
    // @UseGuards(EmployerProfileOwnerGuard)
    @Get(':id')
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
    @Delete(':profileId')
    async delete(@Param('profileId') id: string): Promise<boolean> {
    return await this.employerProfileService.delete(id);
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