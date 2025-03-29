import { EmployerProfileEntity } from "@/core/entities/employer-profile-entity";
import { PageDto } from "@/core/models";
import { CreateEmployerProfileDto } from "@/core/models/employer-profile-create.dto";
import { EmployerPayloadDto } from "@/core/models/employer-profile-payload.dto";
import { EmployerProfileQueryDto } from "@/core/models/employer-profile-query.dto";
import { UpdateEmployerProfileDto } from "@/core/models/employer-profile-update.dto";
import { EmployerProfileService } from "@/core/services/employer-profile.service";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";


export class TypeormEmployerProfileService implements EmployerProfileService{
    constructor(
        private dataSource: DataSource,
        @InjectRepository(EmployerProfileEntity)
        private employerProfileRepo: Repository<EmployerProfileEntity>,
    ) { }
    
    async create(userId: number,values: CreateEmployerProfileDto): Promise<EmployerPayloadDto> {
        const existingProfile = this.employerProfileRepo.findOne({id:userId})
    }
    
    async update(values: UpdateEmployerProfileDto): Promise<EmployerPayloadDto> {
        
    }

    async find(query: EmployerProfileQueryDto): Promise<PageDto<EmployerPayloadDto>> {
        
    }

    async findByUsername(username: string): Promise<EmployerPayloadDto | undefined> {
        
    }

    async findById(id: number): Promise<EmployerPayloadDto> {
        
    }

    async delete(id: number): Promise<undefined> {
        
    }
}

