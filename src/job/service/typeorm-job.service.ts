import { DomainError } from "@/common/errors";
import { EmployerProfileEntity } from "@/core/entities/employer-profile-entity";
import { JobListingEntity } from "@/core/entities/job-listing.entity";
import { UserEntity } from "@/core/entities/user.entity";
import { AuditEvent } from "@/core/events";
import { JobListingCreateDto } from "@/core/models/job-listing-create.dto";
import { JobListingUpdateDto } from "@/core/models/job-listing-update.dto";
import { JobListingDto } from "@/core/models/job-listing.dto";
import { JOB_SERVICE, JobService } from "@/core/services/job.service";
import { Inject, Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class TypeormJobService implements JobService{
    constructor(
        private dataSource: DataSource,
        private eventEmitter: EventEmitter2,
        @InjectRepository(JobListingEntity)
        private jobRepo: Repository<JobListingEntity>,
        @InjectRepository(EmployerProfileEntity)
        private employerRepo: Repository<EmployerProfileEntity>,
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>,    
        // @Inject(JOB_SERVICE)
        // private jobService: JobService
    ) { }
    
    async create(userId: string, values: JobListingCreateDto): Promise<JobListingDto>{
        console.log("inside the service", userId);
        const existingProfile = await this.employerRepo.findOne({
             where: {userId: userId } 
        })
        console.log("the existing profile: ", existingProfile);

        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new DomainError("Please Create An Account First!!")
        console.log("the existing user: ", user);

        if (!existingProfile) {
            throw new DomainError("Create An Employer Profile To Post Job")
        }

        values.employerId = existingProfile.id;

        const newJob = await this.jobRepo.insert({
            title: values.title,
            employer: existingProfile,
            employerId: existingProfile.id,
            description: values.description,
            slug: values.slug,
            skillsRequired: values.skillsRequired,
            budget: values.budget,
            budgetType: values.budgetType,
            deadline: values.deadline,
            experienceLevel: values.experienceLevel,
            status: values.status
        })

        console.log("the skills required: ", values.skillsRequired, values);
        console.log("the new job: ", newJob);

        const jobId = newJob.identifiers[0].id;
        if (!jobId) throw new DomainError("Employer Profile Doesn't exist");

        const job = await this.jobRepo.findOneByOrFail({ id: jobId });

        return job.toDto();
    }

    async update(userId: string, jobId: string, values: JobListingUpdateDto): Promise<void>{
        const entity = await this.jobRepo.findOne({
            where: { id: jobId }        
        });
    
        if (!entity) {
            throw new DomainError('Job not found');
        }

        const dbUpdatedAt = new Date(entity.updatedAt).getTime();
        const userUpdatedAt = new Date(values.updatedAt).getTime();

        if (dbUpdatedAt > userUpdatedAt) {
            throw new DomainError('Profile has been modified since your last request. Please refresh.');
        }

        await this.dataSource.transaction(async (em) => {        
            await em.update(JobListingEntity, jobId, {
                title: values?.title,
                budget: values?.budget,
                budgetType: values?.budgetType,            
                slug: values?.slug,             
                skillsRequired: values?.skillsRequired,
                experienceLevel: values?.experienceLevel,
                status: values?.status,
                deadline: values?.deadline,
                description: values?.description
            });
            
        });
    
        this.eventEmitter.emit(
            'audit.updated',
            new AuditEvent({
                resourceId: `${jobId}`,
                resourceType: 'job',
                context: JSON.stringify({ 
                    title: values.title,
                    updatedBy: userId 
                }),
            }),
        );
    }

    async isJobOwner(userId: string, jobId: string): Promise<boolean>{
        console.log("Inside the job owner service...")
        const employer = await this.employerRepo.findOne({
            where: {userId: userId}
        })

        if (!employer) throw new DomainError("Employer Profile Doesn't Exist");

        const entity = await this.jobRepo.findOne({
            where: { id: jobId }        
        });

        if (employer.id === entity?.employerId) {
            return true;
        }
        console.log("End of the job guard...")

        return false;
    }

    async findById(id: string): Promise<JobListingDto | undefined> {
        const entity = await this.jobRepo.findOne({where: { id: id } });

        return entity?.toDto()
    }
}