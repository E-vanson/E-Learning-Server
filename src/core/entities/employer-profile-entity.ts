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
import { AuditingEntity } from './auditing.entity';
import { EmployerProfileDto } from '../models/employer-profie.dto';

@Entity('employer_profile')
export class EmployerProfileEntity extends AuditingEntity {
  @PrimaryColumn()
  id: number;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'id' })
  user: UserEntity;

  @Column({ type: 'varchar', length: 255, nullable: true })
  companyName: string;

  @Column({ type: 'text', nullable: true })
  companyDescription: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string;
    
  @CreateDateColumn({
    name: 'published_at',
    type: 'timestamptz',
    nullable: true,
   })
  publishedAt?: Date | null;
  
  @Column({ name: 'published_by', type: 'varchar', nullable: true })
  publishedBy?: string 
    
    toDto(compact?: boolean) {
        if (compact) {
            return new EmployerProfileDto({
                id: this.id,
                user: this.user?.toDto(),
                companyName: this.companyName,
                companyDescription: this.companyDescription,
                website: this.website,
                audit: this.toAudit()
          })
        }
        return new EmployerProfileDto({
            id: this.id,
            user: this.user?.toDto(),
            companyName: this.companyName,
            companyDescription: this.companyDescription,
            website: this.website,
            audit: this.toAudit(),
            publishedAt: this.publishedAt?.toISOString(),
        });
  }
}