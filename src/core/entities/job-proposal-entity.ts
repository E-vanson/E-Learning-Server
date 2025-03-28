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
import { JobProposalDto } from '../models/job-proposal.dto';

@Entity('job_proposal')
export class JobProposalEntity extends AuditingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => JobListingEntity)
  @JoinColumn({ name: 'job_id' })
  job: JobListingEntity;

  @ManyToOne(() => FreelancerProfileEntity)
  @JoinColumn({ name: 'd' })
  freelancer: FreelancerProfileEntity;

  @Column({ type: 'text' })
  cover_letter: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  bid_amount: number;

  @Column({ type: 'varchar', length: 100 })
  estimated_time: string;

  @Column({
    type: 'enum',
    enum: ['submitted', 'accepted', 'rejected'],
    default: 'submitted'
  })
  status: string;

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
            freelancer: this.freelancer.toDto(),
            cover_letter: this.cover_letter,
            bid_amount: this.bid_amount,
            estimated_time: this.estimated_time,
            status: this.status,
            audit: this.toAudit(),
            publishedAt: this.publishedAt?.toISOString(),
        })
    }

}