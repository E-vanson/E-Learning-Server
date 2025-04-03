import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { JobListingEntity } from './job-listing.entity';
import { UserEntity } from './user.entity';
import { FreelancerProfileEntity } from './freelancer-profile-entity';
import { audit } from 'rxjs';
import { AuditingEntity } from './auditing.entity';
import { JobProposalDto, ProposalStatus } from '../models/job-proposal.dto';

@Entity('job_proposal')
export class JobProposalEntity extends AuditingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => JobListingEntity)
  @JoinColumn({ name: 'job_id' })
  job: JobListingEntity;

   @Column({ name: "job_id", type: 'uuid' , nullable: true })
  job_id: string;  

  @ManyToOne(() => FreelancerProfileEntity)
  @JoinColumn({ name: 'freelancer_id' })
  freelancer: FreelancerProfileEntity;

  @Column({ name: "freelancer_id", type: 'uuid' , nullable: true })
  freelancer_id: string;  

  @Column({ type: 'text' })
  cover_letter: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  bid_amount: number;

  @Column({ type: 'varchar', length: 100 })
  estimated_time: string;

  @Column({
    type: 'enum',
    enum: ProposalStatus,
    enumName: 'el_job_proposal_status_enum',
    default: ProposalStatus.SUBMITTED
  })
  status: ProposalStatus;

  @CreateDateColumn({
    name: 'published_at',
    type: 'timestamptz',
    nullable: true,
   })
  publishedAt?: Date | null;
  
  @Column({ name: 'published_by', type: 'varchar', nullable: true })
  publishedBy?: string 
  
    toDto() {        
        return new JobProposalDto({
            id: this.id,
            job: this.job?.toDto(),
            jobId: this.job_id,
            freelancer: this.freelancer?.toDto(),
            freelancerId: this.freelancer_id,
            cover_letter: this.cover_letter,
            bid_amount: this.bid_amount,
            estimated_time: this.estimated_time,
            status: this.status,
            audit: this.toAudit(),
            publishedAt: this.publishedAt?.toISOString(),
            publishedBy: this.publishedBy
        })
    }

}