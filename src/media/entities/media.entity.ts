import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'int' })
  userId: number;
  @Column({ type: 'varchar', length: 255 })
  name: string;
  @Column({ type: 'enum', enum: ['image', 'video', 'document', 'other'] })
  type: 'image' | 'video' | 'document' | 'other';
  @Column({ type: 'text', array: true })
  tags: string[];
  @Column({ type: 'json', default: {} })
  meta: any;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt?: Date;
  @ManyToOne(() => User)
  user: User;
}
