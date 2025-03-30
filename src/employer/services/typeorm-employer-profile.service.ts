import { DomainError } from "@/common/errors";
import { EmployerProfileEntity } from "@/core/entities/employer-profile-entity";
import { PageDto } from "@/core/models";
import { EmployerProfileDto } from "@/core/models/employer-profie.dto";
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
    
    async create(userId: string, values: CreateEmployerProfileDto): Promise<EmployerProfileDto> {        
        
        const existingProfile = await this.employerProfileRepo.findOne({
            where: { userId: userId } 
        })

        if (existingProfile) {
            throw new DomainError("Employer Profile Already Exists");
        }

        values.userId = userId;

        const newProfile = await this.employerProfileRepo.insert({
            userId: values.userId,
            companyDescription: values.companydescription,
            companyName: values.companyName,
            website: values.website
        });

        const employerProfileId = newProfile.identifiers[0].id;

        if (!employerProfileId) throw new DomainError("Employer Profile Doesn't exist");

        const employerProfile = await this.employerProfileRepo.findOneByOrFail({ id: employerProfileId });        

        return employerProfile.toDto();
    }
    
    // async update(values: UpdateEmployerProfileDto): Promise<EmployerPayloadDto> {
        
    // }

    // async find(query: EmployerProfileQueryDto): Promise<PageDto<EmployerPayloadDto>> {
        
    // }

    // async findByUsername(username: string): Promise<EmployerPayloadDto | undefined> {
        
    // }

    // async findById(id: number): Promise<EmployerPayloadDto> {
        
    // }

    // async delete(id: number): Promise<undefined> {
        
    // }
}

