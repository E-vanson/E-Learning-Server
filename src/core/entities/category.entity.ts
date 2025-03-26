import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CategoryDto } from '../models';
import { AuditingEntity } from './auditing.entity';

@Entity({ name: 'category' })
export class CategoryEntity extends AuditingEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 2000, nullable: true })
  cover?: string | null;

  toDto() {
    return new CategoryDto({
      id: this.id,
      name: this.name,
      slug: this.slug,
      cover: this.cover ?? undefined,
      audit: this.toAudit(),
    });
  }
}
