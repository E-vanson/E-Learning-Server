import { DomainError } from "@/common/errors";
import { EmployerProfileEntity } from "@/core/entities/employer-profile-entity";
import { FreelancerProfileEntity } from "@/core/entities/freelancer-profile-entity";
import { JobListingEntity } from "@/core/entities/job-listing.entity";
import { JobProposalEntity } from "@/core/entities/job-proposal-entity";
import { UserEntity } from "@/core/entities/user.entity";
import { AuditEvent } from "@/core/events";
import { PageDto, QueryDto } from "@/core/models";
import { FreelancerProfileDto } from "@/core/models/freelancer-profile.dto";
import { CreateJobProposalDto } from "@/core/models/job-proposal-create.dto";
import { JobProposalQueryDto } from "@/core/models/job-proposal-query.dto";
import { JobProposalReviewDto } from "@/core/models/job-proposal-review.dto";
import { UpdateJobProposalDto } from "@/core/models/job-proposal-update.dto";
import { JobProposalDto, ProposalStatus } from "@/core/models/job-proposal.dto";
import { ProposalService } from "@/core/services/job-proposal.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";




@Injectable()
export class TypeormJobProposalService implements ProposalService{
    constructor(
        private dataSource: DataSource,
        private eventEmitter: EventEmitter2,
        @InjectRepository(JobProposalEntity)
        private proposalRepo: Repository<JobProposalEntity>,
        @InjectRepository(FreelancerProfileEntity)
        private freelancerRepo: Repository<FreelancerProfileEntity>,
        @InjectRepository(JobListingEntity)
        private jobRepo: Repository<JobListingEntity>,
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>,
        @InjectRepository(EmployerProfileEntity)
        private employerRepo: Repository<EmployerProfileEntity>
    ){}


    async create(userId: string, jobId: string, values: CreateJobProposalDto): Promise<JobProposalDto>{
        console.log("1");
        const existsProfile = await this.freelancerRepo.findOne({
            where: {
                userId: userId
            }
        });

        if (!existsProfile) throw new DomainError("Please create a Freelancer account First;")
        
        values.freelancer_Id = existsProfile.id;

        const job = await this.jobRepo.findOneByOrFail({ id: jobId  });
        console.log("2", job, values);

        const proposal = this.proposalRepo.create({
            ...values,
            freelancer_id: values.freelancer_Id,
            job: job.toDto(),
            freelancer:existsProfile.toDto()
        });

        // 2. Save to database
        const savedProposal = await this.proposalRepo.save(proposal);

        // 3. Explicitly load relations if needed
        const fullProposal = await this.proposalRepo.findOne({
            where: { id: savedProposal.id },
            relations: ['job', 'freelancer']
        });

        console.log("The proposal created: ", fullProposal);

        if (!fullProposal) {
            throw new NotFoundException('Proposal not found after creation');
        }

        // 4. Convert to DTO
        return fullProposal.toDto();
    }    
        

    async update(profileId: string, proposalId: string, values: UpdateJobProposalDto): Promise<void> {
        const entity = await this.proposalRepo.findOne({ where: { id: proposalId } });

        if (!entity) {
            throw new DomainError("Proposal Not Found!!");
        }                

        const dbUpdatedAt = new Date(entity.updatedAt).getTime();
        const userUpdatedAt = new Date(values.updatedAt).getTime();

        if (dbUpdatedAt > userUpdatedAt) {
            throw new DomainError('Profile has been modified since your last request. Please refresh.');
        }

        await this.dataSource.transaction(async (em) => {
            await em.update(JobProposalEntity, proposalId, {                
                bid_amount: values.bid_amount,
                cover_letter: values.cover_letter,
                estimated_time: values.estimated_time
            })
        })

        this.eventEmitter.emit(
            'audit.updated',
            new AuditEvent({
                resourceId: `${proposalId}`,
                resourceType: 'job',
                context: JSON.stringify({ 
                    bid_amount: values.bid_amount,
                    estimated_time: values.estimated_time,
                    updatedBy: profileId
                }),
            }),
        );


    }

    async findById(id: string): Promise<JobProposalDto | undefined>{
        const entity = await this.proposalRepo.findOne({
            where: { id },
            relations: {
                job: true,
                freelancer: true
            }
        });

        if (!entity) {
            throw new NotFoundException(`Proposal with ID ${id} not found`);
        }

        return entity.toDto();  
    }

    async find(query: JobProposalQueryDto): Promise<PageDto<JobProposalDto>> {
    const { limit, offset } = QueryDto.getPageable(query);
    const queryBuilder = this.proposalRepo.createQueryBuilder('proposal')
        .leftJoinAndSelect('proposal.job', 'job')
        .leftJoinAndSelect('proposal.freelancer', 'freelancer');

    // Apply filters
    if (query.q) {
        queryBuilder.andWhere(
            '(LOWER(proposal.cover_letter) LIKE LOWER(:search) OR ' +
            'LOWER(job.title) LIKE LOWER(:search) OR ' +
            'LOWER(freelancer.headline) LIKE LOWER(:search))', // Added closing parenthesis
            { search: `%${query.q}%` }
        );
    }

    // if (query.job) {
    //     queryBuilder.andWhere('job.id = :jobId', { jobId: query.job.id });
    // }

    // if (query.freelancer) {
    //     if (typeof query.freelancer === 'string') {
    //         queryBuilder.andWhere('freelancer.id = :freelancerId', {
    //             freelancerId: query.freelancer
    //         });
    //     } else {
    //         queryBuilder.andWhere('freelancer.id = :freelancerId', {
    //             freelancerId: query.freelancer.id
    //         });
    //     }
    // }

    if (query.cover_letter) {
        queryBuilder.andWhere('LOWER(proposal.cover_letter) LIKE LOWER(:coverLetter)', {
            coverLetter: `%${query.cover_letter}%`
        });
    }

    if (query.bid_amount) {
        queryBuilder.andWhere('proposal.bid_amount = :bidAmount', { 
            bidAmount: Number(query.bid_amount) 
        });
    }

    if (query.estimated_time) {
        queryBuilder.andWhere('LOWER(proposal.estimated_time) LIKE LOWER(:estimatedTime)', {
            estimatedTime: `%${query.estimated_time}%`
        });
    }

    if (query.status) {
        queryBuilder.andWhere('proposal.status = :status', { 
            status: query.status.toLowerCase() // Ensure lowercase match
        });
    }

    // Ordering
    const orderBy = query.orderBy === 'publishedAt' 
        ? 'proposal.publishedAt' 
        : 'proposal.createdAt';
    queryBuilder.orderBy(orderBy, 'DESC');

    // Get total count
    const totalCount = await queryBuilder.getCount();

    // Apply pagination
    queryBuilder.skip(offset).take(limit);

    // Execute query
    const results = await queryBuilder.getMany();

    return PageDto.from({
        list: results.map(proposal => proposal.toDto()),
        count: totalCount,
        offset,
        limit
    });
}

    async delete(id: string): Promise<void> {
        const entity = await this.proposalRepo.findOneBy({ id: id });
        if (!entity) throw new DomainError("Proposal Not Found");

        await this.dataSource.transaction(async (em) => {
            await em.delete(JobProposalEntity, id);
        });

        this.eventEmitter.emit(
            'job.deleted',
            new AuditEvent({
                resourceId: `${id}`,
                resourceType: 'job-proposal',
                context: JSON.stringify({
                    freelancer: entity.freelancer,
                    bid_amount: entity.bid_amount,
                    cover_letter: entity.cover_letter
                })
            })
        )
        
    }

    async isProposalOwner(userId: string, proposalId: string): Promise<boolean>{            
            const freelancer = await this.freelancerRepo.findOne({
                where: {userId: userId}
            })
    
            if (!freelancer) throw new DomainError("Freelancer Profile Doesn't Exist");
    
            const entity = await this.proposalRepo.findOne({
                where: { id: proposalId }        
            });
    
            if (freelancer.id === entity?.freelancer_id) {
                return true;
            }            
    
            return false;
    }

    async reviewProposal(userId: string, proposalId: string, values: JobProposalReviewDto): Promise<void> {
        //check if user is an employer
        const employer = await this.employerRepo.findOne({
            where: { userId: userId }        
        });

        if (!employer) {
            throw new DomainError('Employer profile not found');
        }

        // proposal exists?
          const proposal = await this.proposalRepo.findOne({
            where: { id: proposalId }        
        });

        if (!proposal) {
            throw new DomainError('Proposal not found');
        }

        const job = await this.jobRepo.findOne({
            where: {id: proposal.job_id}
        })

        if (job?.employerId !== employer.id) {
            throw new DomainError("You can not review this proposal!! You're not the onwer of the job")
        }

        values.reviewedAt = Date.now().toString();

        await this.dataSource.transaction(async (em) => {        
            await em.update(JobProposalEntity, proposalId, {
                status: values.status,
                employerFeedback: values.employerFeedback,
                reviewedAt: values.reviewedAt,
                reviewedBy: employer.id                          
            });
            
        });

        this.eventEmitter.emit(
            'audit.updated',
            new AuditEvent({
                resourceId: `${proposalId}`,
                resourceType: 'job_proposal_review',
                context: JSON.stringify({ 
                    status: values.status,
                    employerFeedback: values.employerFeedback,
                    updatedBy: values.reviewedAt 
                }),
            }),
        );
        
    }

    async isProposalJobOwner(userId: string, proposalId: string): Promise<boolean> {
        const employer = await this.employerRepo.findOne({
            where: { userId: userId }        
        });

        if (!employer) {
            return false            
        }

        // proposal exists?
        const proposal = await this.proposalRepo.findOne({
            where: { id: proposalId }        
        });

        if (!proposal) {
            return false
        }

        const job = await this.jobRepo.findOne({
            where: {id: proposal.job_id}
        })

        if (job?.employerId !== employer.id) {
            return false
        }

        return true;
    }

    async findProposalsByEmployerId(employerId: string, query: JobProposalQueryDto = new JobProposalQueryDto()): Promise<PageDto<JobProposalDto>> {
    const { limit, offset } = QueryDto.getPageable(query);
    
    // First, get all job IDs for this employer
    const employerJobsQuery = this.jobRepo.createQueryBuilder('job')
        .select('job.id')
        .where('job.employerId = :employerId', { employerId });
    
    // Data query with relations
    const dataQuery = this.proposalRepo.createQueryBuilder('proposal')
        .leftJoinAndSelect('proposal.job', 'job')
        .leftJoinAndSelect('proposal.freelancer', 'freelancer')
        .where(`proposal.job_id IN (${employerJobsQuery.getQuery()})`)
        .setParameter('employerId', employerId);

    // Count query (no relations needed)
    const countQuery = this.proposalRepo.createQueryBuilder('proposal')
        .where(`proposal.job_id IN (${employerJobsQuery.getQuery()})`)
        .setParameter('employerId', employerId);

    // ID query for pagination
    const idQuery = this.proposalRepo.createQueryBuilder('proposal')
        .where(`proposal.job_id IN (${employerJobsQuery.getQuery()})`)
        .setParameter('employerId', employerId);

    // Apply filters to all queries
    [dataQuery, countQuery, idQuery].forEach(qb => {
        if (query.q) {
            qb.andWhere(
                '(LOWER(proposal.cover_letter) LIKE LOWER(:search) OR ' +
                'LOWER(job.title) LIKE LOWER(:search) OR ' +
                'LOWER(freelancer.headline) LIKE LOWER(:search))',
                { search: `%${query.q}%` }
            );
        }

        if (query.jobId) {
            qb.andWhere('proposal.job_id = :jobId', { jobId: query.jobId });
        }

        if (query.freelancerId) {
            qb.andWhere('proposal.freelancer_id = :freelancerId', { 
                freelancerId: query.freelancerId 
            });
        }

        if (query.cover_letter) {
            qb.andWhere('LOWER(proposal.cover_letter) LIKE LOWER(:coverLetter)', {
                coverLetter: `%${query.cover_letter}%`
            });
        }

        if (query.bid_amount) {
            qb.andWhere('proposal.bid_amount = :bidAmount', { 
                bidAmount: Number(query.bid_amount) 
            });
        }

        if (query.estimated_time) {
            qb.andWhere('LOWER(proposal.estimated_time) LIKE LOWER(:estimatedTime)', {
                estimatedTime: `%${query.estimated_time}%`
            });
        }

        if (query.status) {
            qb.andWhere('proposal.status = :status', { 
                status: query.status
            });
        }

        // Add date filtering if needed
        if (query.start) {
            qb.andWhere('proposal.created_at >= :startDate', { 
                startDate: new Date(query.start) 
            });
        }

        if (query.end) {
            // Add one day to include the entire end date
            const endDate = new Date(query.end);
            endDate.setDate(endDate.getDate() + 1);
            qb.andWhere('proposal.created_at < :endDate', { endDate });
        }
    });

    const orderByColumn = query.orderBy === 'publishedAt' 
        ? 'proposal.published_at'  // Database column name
        : 'proposal.created_at';   // Database column name

    // Configure ID query
    idQuery
        .select(['proposal.id'])
        .orderBy(orderByColumn, 'DESC')
        .skip(offset)
        .take(limit);

    // Execute queries
    const [totalCount, idList] = await Promise.all([
        countQuery.getCount(),
        idQuery.getMany()
    ]);

    // Get full entities
    let list: JobProposalEntity[] = [];
    if (idList.length > 0) {
        list = await dataQuery
            .andWhereInIds(idList.map(proposal => proposal.id))
            .orderBy(orderByColumn, 'DESC')
            .getMany();
    }

    return PageDto.from({
        list: list.map(proposal => proposal.toDto()),
        count: totalCount,
        offset,
        limit
    });
    }
    
    async findProposalByFreelancerId(freelancerId: string): Promise<JobProposalDto[] | undefined> {
        const entities = await this.proposalRepo.find({ where: { freelancer_id: freelancerId } })
        if (!entities) throw new DomainError("No Proposals Found");

        return entities.map(entity => entity.toDto());
    }

    async findByFreelancerIdAndQuery(freelancerId: string,query: JobProposalQueryDto = new JobProposalQueryDto()): Promise<PageDto<JobProposalDto>> {
        const { limit, offset } = QueryDto.getPageable(query);
        
        // Data query with relations
        const dataQuery = this.proposalRepo.createQueryBuilder('proposal')
            .leftJoinAndSelect('proposal.job', 'job')
            .where('proposal.freelancerId = :freelancerId', { freelancerId });

        // Count query (no relations needed by default)
        const countQuery = this.proposalRepo.createQueryBuilder('proposal')
            .where('proposal.freelancerId = :freelancerId', { freelancerId });

        // ID query for pagination
        const idQuery = this.proposalRepo.createQueryBuilder('proposal')
            .where('proposal.freelancerId = :freelancerId', { freelancerId });

        // Apply filters to all queries
        [dataQuery, countQuery, idQuery].forEach(qb => {
            if (query.q) {
                qb.leftJoin('proposal.job', 'job');
                qb.andWhere(
                    '(LOWER(proposal.cover_letter) LIKE LOWER(:search) OR ' +
                    'LOWER(job.title) LIKE LOWER(:search))',
                    { search: `%${query.q}%` }
                );
            }

            if (query.jobId) {
                qb.andWhere('proposal.jobId = :jobId', { jobId: query.jobId });
            }

            if (query.cover_letter) {
                qb.andWhere('LOWER(proposal.cover_letter) LIKE LOWER(:coverLetter)', {
                    coverLetter: `%${query.cover_letter}%`
                });
            }

            if (query.bid_amount) {
                qb.andWhere('proposal.bid_amount = :bidAmount', {
                    bidAmount: query.bid_amount
                });
            }

            if (query.estimated_time) {
                qb.andWhere('LOWER(proposal.estimated_time) LIKE LOWER(:estimatedTime)', {
                    estimatedTime: `%${query.estimated_time}%`
                });
            }

            if (query.status) {
                qb.andWhere('proposal.status = :status', {
                    status: query.status
                });
            }

            if (query.start) {
                qb.andWhere('proposal.created_at >= :startDate', { 
                    startDate: new Date(query.start) 
                });
            }

            if (query.end) {
                const endDate = new Date(query.end);
                endDate.setDate(endDate.getDate() + 1);
                qb.andWhere('proposal.created_at < :endDate', { endDate });
            }
        });

        const orderByColumn = query.orderBy === 'publishedAt' 
            ? 'proposal.published_at'  // Database column name
            : 'proposal.created_at';    // Database column name

        // Configure ID query
        idQuery
            .select(['proposal.id'])
            .orderBy(orderByColumn, 'DESC')
            .skip(offset)
            .take(limit);

        // Execute queries
        const [totalCount, idList] = await Promise.all([
            countQuery.getCount(),
            idQuery.getMany()
        ]);

        // Get full entities
        let list: JobProposalEntity[] = [];
        if (idList.length > 0) {
            list = await dataQuery
                .andWhereInIds(idList.map(proposal => proposal.id))
                .orderBy(orderByColumn, 'DESC')
                .getMany();
        }

        return PageDto.from({
            list: list.map(proposal => proposal.toDto()),
            count: totalCount,
            offset,
            limit
        });
    }
    
    async updateProposalStatus(proposalId: string, value: ProposalStatus): Promise<boolean> {
        const entity = await this.proposalRepo.findOne({ where: { id: proposalId } });

        if (!entity) {
            throw new DomainError("Proposal Not Found!!");
        }                

        // const dbUpdatedAt = new Date(entity.updatedAt).getTime();
        // const userUpdatedAt = new Date(values.updatedAt).getTime();        

        await this.dataSource.transaction(async (em) => {
            await em.update(JobProposalEntity, proposalId, {                
                status: value
            })
        })

        if (entity.status !== value) return false;

        this.eventEmitter.emit(
            'audit.updated',
            new AuditEvent({
                resourceId: `${proposalId}`,
                resourceType: 'proposal-status',
                context: JSON.stringify({ 
                    status: value
                }),
            }),
        );        

        return true;

    }

    // async getProposalsByEmployer(
    //     employerId: string,
    //     page: number = 1,
    //     limit: number = 10,
    // ): Promise<{ count: number; proposals: JobProposalEntity[] }> {
    //     // First get all job IDs created by this employer
    //     const employerJobs = await this.jobRepo.find({
    //     where: { employerId: employerId },
    //     select: ['id'],
    //     });
        
    //     const jobIds = employerJobs.map(job => job.id);

    //     if (jobIds.length === 0) {
    //     return { count: 0, proposals: [] };
    //     }

    //     // Create query options with pagination
    //     const findOptions: FindManyOptions<JobProposalEntity> = {
    //     where: { job_id: In(jobIds) },
    //     relations: ['job', 'freelancer'],
    //     skip: (page - 1) * limit,
    //     take: limit,
    //     order: { created_at: 'DESC' },
    //     };

    //     // Get proposals and count in parallel
    //     const [proposals, count] = await Promise.all([
    //     this.proposalRepository.find(findOptions),
    //     this.proposalRepository.count(findOptions),
    //     ]);

    //     return {
    //     count,
    //     proposals,
    //     };
    // }


    
}