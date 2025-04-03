import { PageDto } from "../models";
import { CreateJobProposalDto } from "../models/job-proposal-create.dto";
import { JobProposalQueryDto } from "../models/job-proposal-query.dto";
import { JobProposalReviewDto } from "../models/job-proposal-review.dto";
import { UpdateJobProposalDto } from "../models/job-proposal-update.dto";
import { JobProposalDto } from "../models/job-proposal.dto";



export interface ProposalService {
    create(userId: string, jobId: string, values: Partial<CreateJobProposalDto>): Promise<JobProposalDto>;
    
    update(profileId: string, proposalId: string, values:Partial<UpdateJobProposalDto>): Promise<void>;
    
    findById(id: string): Promise<JobProposalDto | undefined>;   

    find(query: JobProposalQueryDto): Promise<PageDto<JobProposalDto>>;        

    delete(id: string): Promise<void>;

    isProposalOwner(id: string, proposalId: string): Promise<boolean>;

    reviewProposal(userId: string, proposalId: string, values: JobProposalReviewDto): Promise<void>;

    isProposalJobOwner(userId: string, proposalId: string): Promise<boolean>;
}

export const JOB_PROPOSAL_SERVICE = 'ProposalService';