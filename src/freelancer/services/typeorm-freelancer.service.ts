import { DomainError } from "@/common/errors";
import { FreelancerProfileEntity } from "@/core/entities/freelancer-profile-entity";
import { UserEntity } from "@/core/entities/user.entity";
import { AuditEvent } from "@/core/events";
import { PageDto, QueryDto, UserDto, UserJobRole } from "@/core/models";
import { CreateFreelancerProfileDto } from "@/core/models/freelancer-profile-create.dto";
import { FreelancerProfileQueryDto } from "@/core/models/freelancer-profile-query.dto";
import { UpdateFreelancerProfileDto } from "@/core/models/freelancer-profile-update.dto";
import { FreelancerProfileDto } from "@/core/models/freelancer-profile.dto";
import { USER_SERVICE, UserService } from "@/core/services";
import { EMPLOYER_PROFILE_SERVICE, EmployerProfileService } from "@/core/services/employer-profile.service";
import { FreelancerService } from "@/core/services/freelancer.service";
import { Inject, NotFoundException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";



export class TypeormFreelancerService implements FreelancerService{
    constructor(
        private dataSource: DataSource,
        private eventEmitter: EventEmitter2,
        @InjectRepository(FreelancerProfileEntity)
        private freelancerRepo: Repository<FreelancerProfileEntity>,
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>,
        @Inject(USER_SERVICE)
        private userService: UserService,
        @Inject(EMPLOYER_PROFILE_SERVICE)
        private employerService: EmployerProfileService
    ) { }
    
    async create(userId: string, values: CreateFreelancerProfileDto): Promise<FreelancerProfileDto> {        
            
            const existingProfile = await this.freelancerRepo.findOne({
                where: { userId: userId } 
            })
            
            const existingEmployerProfile = await this.employerService.findByUserId(userId);

            const user = await this.userRepo.findOne({ where: { id: userId } });
            if (!user) throw new DomainError("Please Create An Account First!!")
    
            if (existingProfile) {
                throw new DomainError("Freelancer Profile Already Exists");
            }
            existingEmployerProfile ?
            await this.userService.updateJobRole(user.id, UserJobRole.HYBRID) : 
            await this.userService.updateJobRole(user.id, UserJobRole.FREELANCER)
            
            values.userId = userId;
    
            const newProfile = await this.freelancerRepo.insert({
                userId: values.userId,
                headline: values.headline,
                hourlyRate: values.hourlyRate,
                portfolioLinks: values.portfolioLinks,
                skills: values.skills,
                overview: values.overview
            });
    
            const freelancerId = newProfile.identifiers[0].id;
    
            if (!freelancerId) throw new DomainError("Freelancer Profile Doesn't exist");
    
        const freelancer = await this.freelancerRepo.findOneByOrFail({ id: freelancerId });        
        
        console.log("The created freelancer: ", freelancer)
    
            return {
                ...freelancer.toDto(),
                hourlyRate: Number(freelancer.hourlyRate) // Convert decimal to number
            };
    }
    
    async update(profileId: string, values: UpdateFreelancerProfileDto): Promise<FreelancerProfileDto | null>{
        console.log("Inside the update profile service")
         // Verify user exists
        if (!(await this.freelancerRepo.existsBy({ userId: values.userId }))) {
            throw new DomainError('User not found');
        }
                
        const entity = await this.freelancerRepo.findOne({
            where: { id: profileId }        
        });
    
        if (!entity) {
            throw new DomainError('Freelancer profile not found');
        }
        
        // const dbUpdatedAt = new Date(entity.updatedAt).getTime();
        // const userUpdatedAt = new Date(values.updatedAt).getTime();
    
        // if (dbUpdatedAt > userUpdatedAt) {
        //     throw new DomainError('Profile has been modified since your last request. Please refresh.');
        // }
    
        const updatedProfile = await this.dataSource.transaction(async (em) => {        
        // Perform the update
            await em.update(FreelancerProfileEntity, profileId, {
                headline: values.headline,
                hourlyRate: values.hourlyRate,
                portfolioLinks: values.portfolioLinks,
                userId: values.userId,
                overview: values.overview,
                skills: values.skills,
            });

            // Return the updated entity
            return em.findOneBy(FreelancerProfileEntity, { 
                id: profileId 
            });
        });       
    
        this.eventEmitter.emit(
            'audit.updated',
            new AuditEvent({
                resourceId: `${profileId}`,
                resourceType: 'employer_profile',
                context: JSON.stringify({ 
                    headline: values.headline,
                    overview: values.overview,
                    updatedBy: values.userId,
                    // updatedAt: userUpdatedAt
                }),
            }),
        );
        return updatedProfile;
    }

    async findById(id: string): Promise<FreelancerProfileDto | undefined> {
        const entity = await this.freelancerRepo.findOneBy({ id: id });
        
        return entity?.toDto();        
    }

    async findByUserId(userId: string): Promise<FreelancerProfileDto | undefined> {
        const entity = await this.freelancerRepo.findOneBy({ userId: userId });
        
        return entity?.toDto();        
    }

    async delete(id: string): Promise<boolean> {
        const entity = await this.freelancerRepo.findOneBy({ id: id });
        if (!entity) throw new DomainError("Profile Not Found");

        const userId = entity.userId;

        const user = await this.userService.findById(userId)
        const jobRole = user?.jobRole

        await this.dataSource.transaction(async (em) => {
            await em.delete(FreelancerProfileEntity, id);
        });

        this.eventEmitter.emit(
            'freelancer-profile.deleted',
            new AuditEvent({
                resourceId: `${id}`,
                resourceType: 'freelancer-profile',
                context: JSON.stringify({overview: entity.overview})
            })
        )

        if (jobRole === UserJobRole.HYBRID) {
            await this.userService.updateJobRole(userId, UserJobRole.EMPLOYER)
        } else {
            await this.userService.updateJobRole(userId, UserJobRole.USER)    
        }
        
        
        return true;        
    }

    async find(query: FreelancerProfileQueryDto): Promise<PageDto<FreelancerProfileDto>> {
        const { limit, offset } = QueryDto.getPageable(query);
    
        // Main query builder
        const queryBuilder = this.freelancerRepo.createQueryBuilder('profile');
    
        // Apply filters
        if (query.headline) {
            queryBuilder.andWhere('profile.headline ILIKE :headline', { 
                headline: `%${query.headline}%` 
            });
        }
    
        if (query.skills) {
            queryBuilder.andWhere('profile.skills ILIKE :skills', {
                skills: `%${query.skills}%`
            });
        }
    
        if (query.hourlyrate) {
            queryBuilder.andWhere('profile.hourlyrate = :hourlyrate', { 
                hourlyrate: query.hourlyrate 
            });
        }
    
        if (query.q) {
            queryBuilder.andWhere(
                '(LOWER(profile.headline) LIKE LOWER(:search) OR ' +
                'LOWER(profile.overview) LIKE LOWER(:search))',
                { search: `%${query.q}%` }
            );
        }
    
        // Ordering
        const orderBy = query.orderBy === 'publishedAt' 
            ? 'profile.publishedAt' 
            : 'profile.createdAt';
        queryBuilder.orderBy(orderBy, 'DESC');
    
        // Get total count
        const totalCount = await queryBuilder.getCount();
    
        // Apply pagination
        queryBuilder.skip(offset).take(limit);
    
        // Execute query
        const results = await queryBuilder.getMany();
        console.log(results, "The results of the query:")
    
        return PageDto.from({
            list: results.map(e => e.toDto()),
            count: totalCount,
            offset,
            limit
        });
    }

    async findByFreelancerName(freelancerName: string): Promise<FreelancerProfileDto | UserDto | undefined> {
        console.log("The freelancer: ", freelancerName)
        const user = await this.userRepo.findOneBy({username: freelancerName });
        if (!user) throw new NotFoundException('User not found');

        // Then find profile by user ID
        const profile = await this.freelancerRepo.findOneBy({ userId: user.id });
        if (!profile) throw new NotFoundException('Freelancer profile not found');

        return {
        ...profile.toDto(),
        ...user.toDto()    
        }; 
    }
}
