import { PageDto } from "../models";
import { CreateJobProposalDto } from "../models/job-proposal-create.dto";
import { JobProposalQueryDto } from "../models/job-proposal-query.dto";
import { UpdateJobProposalDto } from "../models/job-proposal-update.dto";
import { JobProposalDto } from "../models/job-proposal.dto";



export interface ProposalService {
    create(userId: string, jobId: string, values: Partial<CreateJobProposalDto>): Promise<JobProposalDto>;
    
    update(profileId: string, proposalId: string, values:Partial<UpdateJobProposalDto>): Promise<void>;
    
    findById(id: string): Promise<JobProposalDto | undefined>;

    // // findByCompanyName(companyName: string): Promise<EmployerProfileDto | undefined>;

    find(query: JobProposalQueryDto): Promise<PageDto<JobProposalDto>>;        

    delete(id: string): Promise<void>;

    isProposalOwner(id: string, proposalId: any): Promise<boolean>;
}

export const JOB_PROPOSAL_SERVICE = 'ProposalService';