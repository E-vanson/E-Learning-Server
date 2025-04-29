import { JobProposalDto } from "./job-proposal.dto";

export class FreelancerDashboardSummaryDto {
    proposalCount: number;
    contractCount: number;
    proposalReviewCount: number;
    proposals: JobProposalDto[];
}

