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
  id: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'id' })
  employer: UserEntity;

  @Column({ type: 'varchar', length: 2000 })
  title: string;
    
  @Column({ length: 2000, unique: true })
  slug: string;  

  @Column({ type: 'text', nullable: true  })
  description?: string;

  @Column({ type: 'varchar', array: true })
  skillsRequired: string[];

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  budget?: number | null;

  @Column({ 
    type: 'enum',
    enum: BudgetType,    
    default: BudgetType.FIXED
  })
  budgetType: BudgetType | null;

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
  publishedAt?: Date | null;
  
  @Column({ name: 'published_by', type: 'varchar', nullable: true })
  publishedBy?: string | null;  
    
    toDto(compact?: boolean) {
        if (compact) {
            return new JobListingDto({
                id: this.id,
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
            });
        }
        return new JobListingDto({
            id: this.id,
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
            publishedAt: this.publishedAt?.toISOString(),
            publishedBy: this.publishedBy
        })
        
    }
}