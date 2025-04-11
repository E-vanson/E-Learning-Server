import { CreateFreelancerProfileDto } from '@/core/models/freelancer-profile-create.dto';
import { UpdateFreelancerProfileDto } from '@/core/models/freelancer-profile-update.dto';
import { SecurityContextService } from '@/core/security/security-context.service';
import { FREELANCER_PROFILE_SERVICE, FreelancerService } from '@/core/services/freelancer.service';
import { Body, Controller, Delete, Get, HttpStatus, Inject, Param, Post, Put, Query, Res, SerializeOptions, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FreelancerProfileOwnerGuard } from '../guards/freelancer-profile.guard';
import { Response } from 'express';
import { ApiOkResponsePaginated } from '@/common/decorators';
import { FreelancerProfileDto } from '@/core/models/freelancer-profile.dto';
import { FreelancerProfileQueryDto } from '@/core/models/freelancer-profile-query.dto';
import { FreelancerProfileQueryTransformPipe } from '../pipes/freelancer-profile-query.pipe';

@ApiTags('FreelancerProfile')
@ApiBearerAuth()
@Controller('freelancer')
export class FreelancerController {
    constructor(
        private security: SecurityContextService,
        @Inject(FREELANCER_PROFILE_SERVICE)
        private freelancerService: FreelancerService
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
    async create(@Body() values: CreateFreelancerProfileDto) {        
        const user = this.security.getAuthenticatedUser();        
        await this.freelancerService.create(user.id, values)
    }

    // @UseGuards(FreelancerProfileOwnerGuard)
    @Put(':profileId')
    async updateProfile(
        @Param('profileId') profileId: string,
        @Body() values:UpdateFreelancerProfileDto,
    ) {
        console.log("Request thes reached the backend")
        return await this.freelancerService.update(profileId, values)
    }

    @UseGuards(FreelancerProfileOwnerGuard)
    @Get('/profile/:userId')
    async getFreelancerProfileByUserId(
    @Param('userId') id: string,
    @Res({ passthrough: true }) resp: Response, // Injects the Response object to control the HTTP response.
    ) {
    console.log("The freelancer: ", id )
    const result = await this.freelancerService.findByUserId(id);
    if (!result) {
        resp.status(HttpStatus.NO_CONTENT);
    }    
    return result;
    }


    // @SerializeOptions({//determines how the response objec should be serialised
    // groups: ['detail'],
    // })
    @UseGuards(FreelancerProfileOwnerGuard)
    @Get(':id')
    async getFreelancerProfile(
    @Param('id') id: string,
    @Res({ passthrough: true }) resp: Response, // Injects the Response object to control the HTTP response.
    ) {
    console.log("The freelancer: ", id )
    const result = await this.freelancerService.findById(id);
    if (!result) {
        resp.status(HttpStatus.NO_CONTENT);
    }    
    return result;
    }

    
    @UseGuards(FreelancerProfileOwnerGuard)
    @Delete(':id')
    async delete(@Param('id') id: string) {
    await this.freelancerService.delete(id);
    }

    // @SerializeOptions({
    //      groups: ['detail'],
    //  })
     @Get('profile/:freelancerName')
     async getProfileByFreelancerName(
         @Param('freelancerName') freelancerName: string,
         @Res({ passthrough: true }) resp: Response,
     ) {
         console.log("The freelancer: ", freelancerName)
         const result = await this.freelancerService.findByFreelancerName(freelancerName);
         if (!result) {
             resp.status(HttpStatus.NO_CONTENT);
             return undefined;
         }
         return result;
     }

    @Get('profile/:userId')
    async getProfileByUserId( 
         @Param('userId') userId: string, 
         @Res({ passthrough: true }) resp: Response,
     ) {         
         const result = await this.freelancerService.findByUserId(userId);
         if (!result) {
             resp.status(HttpStatus.NO_CONTENT);
             return undefined;
         }
         return result;
     }

    @ApiOkResponsePaginated(FreelancerProfileDto)
    @Get()
    async find(@Query(FreelancerProfileQueryTransformPipe) query: FreelancerProfileQueryDto) {
        return await this.freelancerService.find(query);
    }        
}
