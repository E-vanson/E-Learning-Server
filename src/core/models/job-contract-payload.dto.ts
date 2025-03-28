import { AuditingDto } from "./auditing.dto";
import { EmployerProfileDto } from "./employer-profie.dto";
import { FreelancerProfileDto } from "./freelancer-profile.dto";
import { JobStatus, PaymentStatus } from "./job-contract.dto";
import { JobListingDto } from "./job-listing.dto";
import { JobProposalDto } from "./job-proposal.dto";


export class JobContractPayload {
    id?: number;
    job?: JobListingDto;
    proposal?: JobProposalDto;
    employer?: EmployerProfileDto;
    freelancer?: FreelancerProfileDto;
    start_date?: string;
    end_date?: string;
    status?: JobStatus;
    payment_status?: PaymentStatus;
    payment_amount?: number;
    audit?: AuditingDto;
}