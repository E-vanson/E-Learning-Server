import { CreateContractDto } from "@/core/models/contract-create.dto";
import { UpdateContractDto } from "@/core/models/contract-update.dto";
import { SecurityContextService } from "@/core/security/security-context.service";
import { CONTRACT_SERVICE, ContractService } from "@/core/services/contract.service";
import { Body, Controller, Delete, Get, HttpStatus, Inject, Param, Post, Put, Query, Res, SerializeOptions, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ContractOwnerGuard } from "../guards/contract.guard";
import { Response } from "express";
import { ApiOkResponsePaginated } from "@/common/decorators";
import { ContractDto } from "@/core/models/contract.dto";
import { ContractQueryDto } from "@/core/models/contract-query.dto";
import { ContractQueryTransformPipe } from "../pipes/contract-query.pipe";


@ApiTags("JobContract")
@ApiBearerAuth()    
@Controller('contract')        
export class ContractController{
    constructor(
        private security: SecurityContextService,
        @Inject(CONTRACT_SERVICE)
        private contractService: ContractService
    ) { }
    
     @Post()
    @ApiOperation({ summary: 'Create job contract' })
    @ApiResponse({ 
        status: 201, 
        description: 'Contract created successfully' 
    })
    @ApiResponse({ 
        status: 401, 
        description: 'Unauthorized' 
    })
    @ApiResponse({ 
        status: 409, 
        description: 'Profile already exists' 
    })
     async create(@Body() values: CreateContractDto) {                 
        const user = this.security.getAuthenticatedUser();        
        await this.contractService.create(user.id, values)
     }
    
    @Put(':id')
    async updateContract(
        @Param('id') contractId: string,
        @Body() values:UpdateContractDto, 
    ) {
        console.log("The values for updating: ", values)
        const user = this.security.getAuthenticatedUser();        
        return await this.contractService.update(user.id, contractId ,values)
    }

    @SerializeOptions({//determines how the response objec should be serialised
    groups: ['detail'],
    })
    @UseGuards(ContractOwnerGuard)
    @Get(':id')
    async getContract(
    @Param('id') id: string,
    @Res({ passthrough: true }) resp: Response, // Injects the Response object to control the HTTP response.
    ) {
    const result = await this.contractService.findById(id);
    if (!result) {
        resp.status(HttpStatus.NO_CONTENT);
    }    
    return result;
    }


    @UseGuards(ContractOwnerGuard)
    @Delete('/employer/:id')
    async delete(@Param('id') id: string) {
    console.log("This is the req handler: ")    
    await this.contractService.delete(id);
    }

    // @UseGuards(ContractOwnerGuard)
    @ApiOkResponsePaginated(ContractDto)
    @Get()
    async find(@Query(ContractQueryTransformPipe) query: ContractQueryDto) {
        return await this.contractService.find(query);
    }




}