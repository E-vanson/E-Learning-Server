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
import { JobProposalEntity } from './job-proposal-entity';
import { UserEntity } from './user.entity';
import { EmployerProfileEntity } from './employer-profile-entity';
import { FreelancerProfileEntity } from './freelancer-profile-entity';
import { JobContractDto, JobStatus, PaymentStatus } from '../models/job-contract.dto';

@Entity('job_contract')
export class JobContractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => JobListingEntity)
  @JoinColumn({ name: 'id' })
  job: JobListingEntity;

  @ManyToOne(() => JobProposalEntity)
  @JoinColumn({ name: 'id' })
  proposal: JobProposalEntity;

  @ManyToOne(() => EmployerProfileEntity)
  @JoinColumn({ name: 'id' })
  employer: EmployerProfileEntity;

  @ManyToOne(() => FreelancerProfileEntity)
  @JoinColumn({ name: 'id' })
  freelancer: FreelancerProfileEntity;

  @Column({ type: 'timestamp' })
  start_date: Date;

  @Column({ type: 'timestamp' })
  end_date: Date;

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.ACTIVE
  })
  status: JobStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING
  })
  payment_status: PaymentStatus;
    
    @Column({ type: 'number' })
    payment_amount: number;
       

  @CreateDateColumn({
    name: 'published_at',
    type: 'timestamptz',
    nullable: true,
   })
  publishedAt?: Date | null;
  
  @Column({ name: 'published_by', type: 'varchar', nullable: true })
    publishedBy?: string 
    
    toDto() {
        return new JobContractDto({
            id: this.id,
            job: this.job.toDto(),
            proposal: this.proposal.toDto(),
            employer: this.employer.toDto(),
            freelancer: this.freelancer.toDto(),
            start_date: this.start_date.toISOString(),
            end_date: this.end_date.toISOString(),
            status: this.status,
            payment_status: this.payment_status,
            payment_amount: this.payment_amount,
            publishedAt: this.publishedAt?.toISOString(),
        })
    }
}