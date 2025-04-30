import { PageDto } from "../models";
import { CreateJobProposalDto } from "../models/job-proposal-create.dto";
import { JobProposalQueryDto } from "../models/job-proposal-query.dto";
import { JobProposalReviewDto } from "../models/job-proposal-review.dto";
import { UpdateJobProposalDto } from "../models/job-proposal-update.dto";
import { JobProposalDto, ProposalStatus } from "../models/job-proposal.dto";



export interface ProposalService {
    create(userId: string, jobId: string, values: Partial<CreateJobProposalDto>): Promise<JobProposalDto>;
    
    update(profileId: string, proposalId: string, values:Partial<UpdateJobProposalDto>): Promise<void>;

    updateProposalStatus(proposalId: string, value: ProposalStatus): Promise<boolean>;
    
    findById(id: string): Promise<JobProposalDto | undefined>;   

    find(query: JobProposalQueryDto): Promise<PageDto<JobProposalDto>>;        

    delete(id: string): Promise<void>;

    isProposalOwner(id: string, proposalId: string): Promise<boolean>;

    reviewProposal(userId: string, proposalId: string, values: JobProposalReviewDto): Promise<void>;

    isProposalJobOwner(userId: string, proposalId: string): Promise<boolean>;

    findProposalsByEmployerId(employerId: string, query: JobProposalQueryDto): Promise<PageDto<JobProposalDto>>
    
    findProposalByFreelancerId(freelancerId: string): Promise<JobProposalDto[] | undefined>
    
    findByFreelancerIdAndQuery(freelancerId: string, query: JobProposalQueryDto): Promise<PageDto<JobProposalDto>>
} 

export const JOB_PROPOSAL_SERVICE = 'ProposalService';