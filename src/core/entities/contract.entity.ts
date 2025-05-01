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

  @ManyToOne(() => FreelancerProfileEntity)
  @JoinColumn({ name: 'freelancer_id' })
  freelancer: FreelancerProfileEntity;  

  @ManyToOne(() => EmployerProfileEntity)
  @JoinColumn({ name: 'employer_id' })
  employer: EmployerProfileEntity;  

  @Column({
  type: 'jsonb',
  default: {},  
})
  terms: ContractTerms;

  @Column({
    type: 'enum',
    enum: ContractStatus,
    default: ContractStatus.draft
  })
  status: ContractStatus;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  payment_amount: number;

  @Column({ type: 'enum',enum: Currency, default: Currency.DOLLAR})
  payment_currency: Currency;

  @Column({ type: 'jsonb', nullable: true })
  milestones: Milestone[];

    toDto(){
        return new ContractDto({
            id: this.id,
            employer: this.employer,            
            job: this.job?.toDto(),            
            freelancer: this.freelancer,            
            terms: this.terms,
            startDate: this.startDate,
            endDate: this.endDate,
            paymentAmount: this.payment_amount,
            paymentCurrency: this.payment_currency,
            milestones: this.milestones,
            status: this.status
        })
    }
}

