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
import { UserEntity } from './user.entity';
import { AuditingEntity } from './auditing.entity';
import { BudgetType, ExperienceLevel, JobListingDto, JobStatus } from '../models/job-listing.dto';


@Entity('job_listing')
export class JobListingEntity extends AuditingEntity {
  @PrimaryColumn()
  job_id: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'id' })
  employer: UserEntity;

  @Column({ type: 'varchar', length: 2000 })
  title: string;
    
  @Column({ length: 2000, unique: true })
  slug: string;  

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', array: true })
  skillsRequired: string[];

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  budget: number | null;

  @Column({ 
    type: 'enum',
    enum: BudgetType,
    nullable: true,
    default: BudgetType.FIXED
  })
  budgetType: BudgetType | null;

  @Column({ type: 'timestamp' })
  deadline: Date;

  @Column({ type: 'varchar', enum: ExperienceLevel, nullable: true })
  experienceLevel: ExperienceLevel;  

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.ACTIVE
  })
  status: JobStatus;
    
    toDto() {
        return new JobListingDto({
            job_id: this.job_id,
            employer: this.employer.toDto(),
            title: this.title,
            slug: this.slug,
            description: this.description,
            skillsRequired: this.skillsRequired,
            budget: this.budget,
            budgetType: this.budgetType,
            deadline: this.deadline,
            experienceLevel: this.experienceLevel,
            status: this.status,
            audit: this.toAudit(),
        })
    }
}