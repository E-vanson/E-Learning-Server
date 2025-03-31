import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { audit } from 'rxjs';
import { AuditingEntity } from './auditing.entity';
import { FreelancerProfileDto, PortfolioLinks } from '../models/freelancer-profile.dto';


@Entity('freelancer_profile')
export class FreelancerProfileEntity extends AuditingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  headline: string;

  @Column({ type: 'text', nullable: true })
  overview: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  hourlyRate: number;

  @Column('varchar', { array: true, nullable: true })
  skills: string[];

  @Column({ type: 'jsonb', nullable: true })
  portfolioLinks: PortfolioLinks[];
  
  @Column({ name: 'published_by', type: 'varchar', nullable: true })
  publishedBy?: string   
  
    toDto() {        
        return new FreelancerProfileDto({
            id: this.id,
            userId: this.userId,
            headline: this.headline,
            overview: this.overview,
            hourlyRate: this.hourlyRate,
            skills: this.skills,
            portfolioLinks: this.portfolioLinks,
            audit: this.toAudit(),           
        })
    }
}