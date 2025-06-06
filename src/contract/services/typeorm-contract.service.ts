import { EmployerProfileEntity } from "@/core/entities/employer-profile-entity";
import { FreelancerProfileEntity } from "@/core/entities/freelancer-profile-entity";
import { JobListingEntity } from "@/core/entities/job-listing.entity";
import { CreateContractDto } from "@/core/models/contract-create.dto";
import { ContractDto } from "@/core/models/contract.dto";
import { ContractService } from "@/core/services/contract.service";
import { EMPLOYER_PROFILE_SERVICE, EmployerProfileService } from "@/core/services/employer-profile.service";
import { FREELANCER_PROFILE_SERVICE, FreelancerService } from "@/core/services/freelancer.service";
import { JOB_SERVICE, JobService } from "@/core/services/job.service";
import { ForbiddenException, Inject } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { JobContractEntity } from "@/core/entities/contract.entity";
import { DomainError } from "@/common/errors";
import { UpdateContractDto } from "@/core/models/contract-update.dto";
import { UserEntity } from "@/core/entities/user.entity";
import { AuditEvent } from "@/core/events";
import { PageDto, QueryDto } from "@/core/models";
import { ContractQueryDto } from "@/core/models/contract-query.dto";
import { JOB_PROPOSAL_SERVICE, ProposalService } from "@/core/services/job-proposal.service";
import { JobProposalEntity } from "@/core/entities/job-proposal-entity";


export class TypeormContractService implements ContractService{
    constructor(
        private dataSource: DataSource,
        private eventEmitter: EventEmitter2,
        @InjectRepository(EmployerProfileEntity)
        private employerRepo: Repository<EmployerProfileEntity>,
        @InjectRepository(JobListingEntity)
        private jobRepo: Repository<JobListingEntity>,
        @InjectRepository(FreelancerProfileEntity)
        private freelancerRepo: Repository<FreelancerProfileEntity>,        
        @InjectRepository(JobContractEntity)
        private contractRepo: Repository<JobContractEntity>,
        @InjectRepository(JobProposalEntity)
        private proposalRepo: Repository<JobProposalEntity>,  
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>,
        @Inject(FREELANCER_PROFILE_SERVICE)
        private freenlancerService: FreelancerService,
        @Inject(EMPLOYER_PROFILE_SERVICE)
        private employerService: EmployerProfileService,
        @Inject(JOB_SERVICE)
        private jobService: JobService,
        @Inject(JOB_PROPOSAL_SERVICE)
        private proposalService: ProposalService
    ) { }
    
    async create(userId: string, values: CreateContractDto): Promise<boolean> {
        const [job, freelancer, proposal] = await Promise.all([
        this.jobService.findById(values.jobId),
        this.freenlancerService.findById(values.freelancerId),
        this.proposalService.findById(values.proposalId)
        ]);

        const employer = await this.employerRepo.findOne({ where: { userId: userId } })        
        
        if (job?.employerId !== employer?.id) {
            throw new ForbiddenException('You can only create contracts for your jobs');
        }
        
        const newContract = await this.contractRepo.insert({
            job: job,
            freelancer: freelancer,
            employer: employer?.toDto(),
            proposal: proposal,
            terms: values.terms,
            startDate: values.startDate,
            endDate: values.endDate,
            payment_amount: values.paymentAmount,
            payment_currency: values.paymentCurrency,
            milestones: values.milestones,            
        })        

        const contractId = newContract.identifiers[0].id;

        if (!contractId) throw new DomainError("Contract Id not found")
        
        const contract = await this.contractRepo.findOneByOrFail({ id: contractId });
        if(contract){
            return true;
        }

         return false;
        
    }

    async update(userId: string, contractId: string, values: UpdateContractDto): Promise<boolean> {
        if (!(await this.userRepo.existsBy({ id: userId }))) {
        throw new DomainError('User not found');
        }
        
         const entity = await this.contractRepo.findOne({
            where: { id: contractId }        
        });
    
        if (!entity) {
            throw new DomainError('Contract not found');
        }

        const dbUpdatedAt = new Date(entity.updatedAt).getTime();
        const userUpdatedAt = new Date(values.updatedAt).getTime();

        if (dbUpdatedAt > userUpdatedAt) {
            throw new DomainError('Profile has been modified since your last request. Please refresh.');
        }

        await this.dataSource.transaction(async (em) => {        
            await em.update(JobContractEntity, contractId, {
                  terms: values.terms,
                  startDate: values.startDate,
                  endDate: values.endDate,
                  payment_amount: values.paymentAmount,
                  payment_currency: values.paymentCurrency,
                  milestones: values.milestones,
                  status: values.status
            });
            
        });
    
        this.eventEmitter.emit(
            'audit.updated',
            new AuditEvent({
                resourceId: `${contractId}`,
                resourceType: 'job_contract',
                context: JSON.stringify({ 
                    terms: values.terms,
                    updatedBy: userId 
                }),
            }),
        );
        return true
    }

    async delete(id: string): Promise<boolean> {
        const entity = await this.contractRepo.findOneBy({ id: id });
            if (!entity) throw new DomainError("Contract Not Found");

            await this.dataSource.transaction(async (em) => {
                await em.delete(JobContractEntity, id);
            });

            this.eventEmitter.emit(
                'job-contract.deleted', 
                new AuditEvent({
                    resourceId: `${id}`,
                    resourceType: 'job-contract',
                    context: JSON.stringify({terms: entity.terms})
                })
            )
        return true;        
    }

    async findById(id: string): Promise<ContractDto | undefined> {
        const entity = await this.contractRepo.findOne({
            where: { id },
            relations: ['job', 'freelancer', 'employer'],
        });        
        console.log("The contrat rsults: ", entity) 
        
        return entity?.toDto();  
    }

    async find(query: ContractQueryDto): Promise<PageDto<ContractDto>> {
    const { limit, offset } = QueryDto.getPageable(query);
    const queryBuilder = this.contractRepo.createQueryBuilder('contract')
        .leftJoinAndSelect('contract.job', 'job')
        .leftJoinAndSelect('contract.freelancer', 'freelancer')
        .leftJoinAndSelect('contract.employer', 'employer');

    // Apply filters
    if (query.q) {
        queryBuilder.andWhere(
            `(contract.terms::text ILIKE :search OR 
             job.title ILIKE :search OR 
             employer.companyName ILIKE :search)`,
            { search: `%${query.q}%` }
        );
    }

    if (query.jobId) {
        queryBuilder.andWhere('contract.job_id = :jobId', { jobId: query.jobId });
    }

    if (query.freelancerId) {
        queryBuilder.andWhere('contract.freelancer_id = :freelancerId', { 
            freelancerId: query.freelancerId 
        });
    }

    if (query.employerId) {
        queryBuilder.andWhere('contract.employer_id = :employerId', { 
            employerId: query.employerId 
        });
    }

    if (query.status) {
        queryBuilder.andWhere('contract.status = :status', { 
            status: query.status 
        });
    }

    if (query.startDateBefore) {
        queryBuilder.andWhere('contract.startDate <= :startDateBefore', { 
            startDateBefore: query.startDateBefore 
        });
    }

    if (query.endDateAfter) {
        queryBuilder.andWhere('contract.endDate >= :endDateAfter', { 
            endDateAfter: query.endDateAfter 
        });
    }

    if (query.terms) {
        queryBuilder.andWhere(`contract.terms->>'scopeOfWork' ILIKE :terms`, { 
            terms: `%${query.terms}%` 
        });
    }

    // Ordering
    const orderBy = query.orderBy === 'publishedAt' 
        ? 'contract.publishedAt' 
        : 'contract.createdAt';
    queryBuilder.orderBy(orderBy, 'DESC');

    // Get total count
    const totalCount = await queryBuilder.getCount();

    // Apply pagination
    queryBuilder.skip(offset).take(limit);

    // Execute query
    const results = await queryBuilder.getMany();       

    console.log("The contracts from the be: ", results);   
    return PageDto.from({
        list: results.map(contract => contract.toDto()),
        count: totalCount,
        offset,
        limit
    });
    }
    
    async isContractOwner(userId: string, contractId: string): Promise<boolean>{
        const employer = await this.employerService.findByUserId(userId);
        console.log("inside the contract service: ", employer, contractId);  
        if (!employer) throw new DomainError("Employer Profile Not Found");

        const contract = await this.findById(contractId);        
        console.log("inside the contract service: ", contract);  
        if (contract?.employer.id === employer.id) {
            return true;
        }

        return false;
    }    

    async ifContractExistsForProposal(proposalId: string): Promise<ContractDto | undefined>{
        const contract = await this.contractRepo.findOne({
            where: {
                proposal: { id: proposalId }
            },
            relations: ['proposal'] // Include the proposal relation if needed
        });
        
        return contract?.toDto();
    }
    
}