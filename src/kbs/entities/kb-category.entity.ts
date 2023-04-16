import { Media } from 'src/media/entities/media.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Kb } from './kb.entity';

@Entity()
export class KbCategory {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 255 })
  name: string;
  @Column({ type: 'text', nullable: true })
  description?: string;
  @Column({ type: 'int', nullable: true })
  imageId: number;
  @Column({ type: 'int', default: 0 })
  priority: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt?: Date;
  @OneToMany(() => Kb, (kb) => kb.category)
  kbs: Kb[];
  @ManyToOne(() => Media, { eager: true, nullable: true })
  image: Media;
}
