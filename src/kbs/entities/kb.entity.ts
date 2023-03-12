import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { KbCategory } from './kb-category.entity';

type KbStatus = 'draft' | 'published';

@Entity()
export class Kb {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;
  @Column({ type: 'text' })
  description?: string;
  @Column({ type: 'text', nullable: true })
  content?: string;
  @Column({ type: 'int' })
  categoryId: number;
  @Column({ type: 'enum', enum: ['draft', 'published'], default: 'draft' })
  status: KbStatus;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt?: Date;
  @ManyToOne(() => KbCategory, (category) => category.kbs)
  category: KbCategory;
}
