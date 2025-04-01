import { DomainError } from "@/common/errors";
import { EmployerProfileEntity } from "@/core/entities/employer-profile-entity";
import { JobListingEntity } from "@/core/entities/job-listing.entity";
import { UserEntity } from "@/core/entities/user.entity";
import { AuditEvent } from "@/core/events";
import { PageDto, QueryDto } from "@/core/models";
import { JobListingCreateDto } from "@/core/models/job-listing-create.dto";
import { JobListingQueryDto } from "@/core/models/job-listing-query.dto";
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

    async find(query: JobListingQueryDto): Promise<PageDto<JobListingDto>> {
        const { limit, offset } = QueryDto.getPageable(query);

        const queryBuilder = this.jobRepo.createQueryBuilder('job');

        // Apply filters
        if (query.title) {
            queryBuilder.andWhere('job.title ILIKE :title', {
                title: `%${query.title}%`
            });
        }

        if (query.skillsRequired) {
            const skillsArray = Array.isArray(query.skillsRequired)
                ? query.skillsRequired
                : [query.skillsRequired];
                        
            const lowerCaseSkills = skillsArray.map(skill => skill.toLowerCase());
            
            queryBuilder.andWhere(
                `EXISTS (
                    SELECT 1 FROM unnest(job.skillsRequired) AS skill 
                    WHERE LOWER(skill) = ANY(ARRAY[:...skills]::varchar[])
                )`,
                { skills: lowerCaseSkills }
            );
        }    

        if (query.minBudget) {
            queryBuilder.andWhere('job.budget >= :minBudget', {
                minBudget: query.minBudget
            });
        }

        if (query.maxBudget) {
            queryBuilder.andWhere('job.budget <= :maxBudget', {
                maxBudget: query.maxBudget
            });
        }

        if (query.budgetType) {
            queryBuilder.andWhere('job.budgetType = :budgetType', {
                budgetType: query.budgetType
            });
        }

        if (query.status) {
            queryBuilder.andWhere('job.status = :status', {
                status: query.status
            });
        }

        if (query.experienceLevel) {
            queryBuilder.andWhere('job.experienceLevel = :experienceLevel', {
                experienceLevel: query.experienceLevel
            });
        }

        if (query.q) {
            queryBuilder.andWhere(
                '(LOWER(job.title) LIKE LOWER(:search) OR ' +
                'LOWER(job.description) LIKE LOWER(:search))',
                { search: `%${query.q}%` }
            );
        }

        // Ordering
        const orderBy = query.orderBy === 'publishedAt' 
            ? 'job.publishedAt' 
            : 'job.createdAt';
        queryBuilder.orderBy(orderBy, 'DESC');

        // Get total count
        const totalCount = await queryBuilder.getCount();

        // Apply pagination
        queryBuilder.skip(offset).take(limit);        

        // Execute query
        const results = await queryBuilder.getMany();

        return PageDto.from({
            list: results.map(job => job.toDto()),
            count: totalCount,
            offset,
            limit
        });
    }

    async delete(id: string): Promise<void>{
        const entity = await this.jobRepo.findOneBy({ id: id });
        if (!entity) throw new DomainError("Job Not Found");

        await this.dataSource.transaction(async (em) => {
            await em.delete(JobListingEntity, id);
        });

        this.eventEmitter.emit(
            'job.deleted',
            new AuditEvent({
                resourceId: `${id}`,
                resourceType: 'job',
                context: JSON.stringify({title: entity.title})
            })
        )
    }
}