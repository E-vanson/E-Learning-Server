import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { AuditingEntity } from './auditing.entity';
import { BudgetType, ExperienceLevel, JobListingDto, JobStatus } from '../models/job-listing.dto';
import { EmployerProfileEntity } from './employer-profile-entity';


@Entity('job_listing')
export class JobListingEntity extends AuditingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => EmployerProfileEntity)
  @JoinColumn({ name: 'userId' })
  employer: EmployerProfileEntity;

  @Column({ type: 'varchar', length: 2000 })
  employerId: string

  @Column({ type: 'varchar', length: 2000 })
  title: string;
    
  @Column({ length: 2000})
  slug: string;  

  @Column({ type: 'text', nullable: true  })
  description?: string;

  @Column({ type: 'varchar', array: true })
  skillsRequired: string[];

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  budget?: number;

  @Column({ 
    type: 'enum',
    enum: BudgetType,    
    default: BudgetType.FIXED
  })
  budgetType: BudgetType;

  @Column({ type: 'timestamp' })
  deadline: Date;

  @Column({
    type: 'enum',
    enum: ExperienceLevel,
    default: ExperienceLevel.INTERMEDIATE        
  })
  experienceLevel: ExperienceLevel;  

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.ACTIVE
  })
  status: JobStatus;
    
  @CreateDateColumn({
      name: 'published_at',
      type: 'timestamptz',
      nullable: true,
   })
  publishedAt?: Date;
  
  @Column({ name: 'published_by', type: 'varchar', nullable: true })
  publishedBy?: string                          ;  
    
    toDto() {        
        return new JobListingDto({
            id: this.id,
            employer: this.employer,
            employerId: this.employerId,
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
            publishedAt: this.publishedAt?.toISOString(),
            publishedBy: this.publishedBy
        })
        
    }
}