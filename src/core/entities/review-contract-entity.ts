import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryColumn,
  Check,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { JobContractEntity } from './job-contract-entity';

@Entity('reviews')
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => JobContractEntity)
  @JoinColumn({ name: 'contract_id' })
  contract: JobContractEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'reviewer_id' })
  reviewer: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'reviewee_id' })
  reviewee: UserEntity;

  @Column({ type: 'int' })
  @Check('rating BETWEEN 1 AND 5')
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}