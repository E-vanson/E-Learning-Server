import {
  Entity,
  PrimaryGeneratedColumn,
  Column,  
} from 'typeorm';
import { UserEntity } from './user.entity';
import { AuditingEntity } from './auditing.entity';
import { EmployerProfileDto } from '../models/employer-profie.dto';

@Entity('employer_profile')
export class EmployerProfileEntity extends AuditingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'company_name', type: 'varchar', length: 255 })
  companyName: string;

  @Column({ name: 'company_description', type: 'text' })
  companyDescription: string;

  @Column({ type: 'varchar', length: 255 })
  website: string;  

  @Column({ name: 'published_by', type: 'varchar', nullable: true })
  publishedBy?: string | null;

  toDto() {
    return new EmployerProfileDto({
      id: this.id,
      userId: this.userId,
      companyName: this.companyName,
      companyDescription: this.companyDescription,
      website: this.website,
      audit: this.toAudit(),     
    });
  }
}