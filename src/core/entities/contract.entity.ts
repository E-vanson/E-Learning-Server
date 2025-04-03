import { JobListingEntity } from './job-listing.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AuditingEntity } from './auditing.entity';
import { FreelancerProfileEntity } from './freelancer-profile-entity';
import { EmployerProfileEntity } from './employer-profile-entity';
import { ContractDto, ContractStatus, ContractTerms, Currency, Milestone } from '../models/contract.dto';

@Entity('job_contract')
export class JobContractEntity extends AuditingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => JobListingEntity)
  @JoinColumn({ name: 'job_id' })
  job: JobListingEntity;
    
  @Column({ type: 'uuid', length: 2000 })
  job_Id: string  

  @ManyToOne(() => FreelancerProfileEntity)
  @JoinColumn({ name: 'freelancer_id' })
  freelancer: FreelancerProfileEntity;
    
  @Column({ type: 'uuid', length: 2000 })
  freelancer_Id: string  

  @ManyToOne(() => EmployerProfileEntity)
  @JoinColumn({ name: 'employer_id' })
  employer: EmployerProfileEntity;
    
  @Column({ type: 'uuid', length: 2000 })
  employer_Id: string  

  @Column({ type: 'jsonb' })
  terms: ContractTerms;

  @Column({
    type: 'enum',
    enum: ContractStatus,
    default: ContractStatus.DRAFT
  })
  status: ContractStatus;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  paymentAmount: number;

  @Column({ type: 'enum',enum: Currency, default: Currency.DOLLAR})
  paymentCurrency: Currency;

  @Column({ type: 'jsonb', nullable: true })
  milestones: Milestone[];

    toDto(){
        return new ContractDto({
            id: this.id,
            employer: this.employer.toDto(),
            employerId: this.employer_Id,
            job: this.job.toDto(),
            jobId: this.job_Id,
            freelancer: this.freelancer,
            freelancerId: this.freelancer_Id,
            terms: this.terms,
            startDate: this.startDate,
            endDate: this.endDate,
            paymentAmount: this.paymentAmount,
            paymentCurrency: this.paymentCurrency,
            milestones: this.milestones,
            status: this.status
        })
    }
}

