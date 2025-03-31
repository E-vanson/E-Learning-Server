import { DomainError } from "@/common/errors";
import { EmployerProfileEntity } from "@/core/entities/employer-profile-entity";
import { UserEntity } from "@/core/entities/user.entity";
import { AuditEvent } from "@/core/events";
import { PageDto } from "@/core/models";
import { EmployerProfileDto } from "@/core/models/employer-profie.dto";
import { CreateEmployerProfileDto } from "@/core/models/employer-profile-create.dto";
import { EmployerPayloadDto } from "@/core/models/employer-profile-payload.dto";
import { EmployerProfileQueryDto } from "@/core/models/employer-profile-query.dto";
import { EmployerProfileUpdateDto } from "@/core/models/employer-profile-update.dto";
import { EmployerProfileService } from "@/core/services/employer-profile.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";


export class TypeormEmployerProfileService implements EmployerProfileService{    
    constructor(
        private dataSource: DataSource,
        private eventEmitter: EventEmitter2,
        @InjectRepository(EmployerProfileEntity)
        private employerProfileRepo: Repository<EmployerProfileEntity>,
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>
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

    async update(values: EmployerProfileUpdateDto): Promise<void> {
    // Verify user exists
    if (!(await this.userRepo.existsBy({ id: values.userId }))) {
        throw new DomainError('User not found');
    }

    const profileId = values.id;
    const entity = await this.employerProfileRepo.findOne({
        where: { id: profileId }        
    });

    if (!entity) {
        throw new DomainError('Employer profile not found');
    }
    
    const dbUpdatedAt = new Date(entity.updatedAt).getTime();
    const userUpdatedAt = new Date(values.updatedAt).getTime();

    if (dbUpdatedAt > userUpdatedAt) {
        throw new DomainError('Profile has been modified since your last request. Please refresh.');
    }

    await this.dataSource.transaction(async (em) => {        
        await em.update(EmployerProfileEntity, profileId, {
            companyName: values.companyName,
            companyDescription: values.companyDescription,
            website: values.website,            
            userId:  values.userId,             
        });
        
    });

    this.eventEmitter.emit(
        'audit.updated',
        new AuditEvent({
            resourceId: `${profileId}`,
            resourceType: 'employer_profile',
            context: JSON.stringify({ 
                company: values.companyName,
                updatedBy: values.userId 
            }),
        }),
    );
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

