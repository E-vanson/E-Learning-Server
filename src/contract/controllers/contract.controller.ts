import { CreateContractDto } from "@/core/models/contract-create.dto";
import { UpdateContractDto } from "@/core/models/contract-update.dto";
import { SecurityContextService } from "@/core/security/security-context.service";
import { CONTRACT_SERVICE, ContractService } from "@/core/services/contract.service";
import { Body, Controller, Inject, Param, Post, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";


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
    async updateProfile(
        @Param('id') contractId: string,
        @Body() values:UpdateContractDto,
    ) {
        const user = this.security.getAuthenticatedUser();        
        return await this.contractService.update(user.id, contractId ,values)
    }

    



}