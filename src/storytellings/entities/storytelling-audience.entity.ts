import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Storytelling } from './storytelling.entity';

@Entity()
@Unique(['storytellingId', 'userId'])
export class StorytellingAudience {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  storytellingId: number;
  @Column()
  userId: number;
  @Column({ type: 'boolean', default: false })
  bookmark: boolean;
  @Column({ type: 'int', default: 0 })
  numViews: number;
  @Column({ type: 'int', default: 0 })
  numListens: number;
  @Column({ type: 'int', default: 0 })
  numListeners: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt?: Date;
  @ManyToOne(() => Storytelling, { onDelete: 'CASCADE' })
  storytelling: Storytelling;
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;
}
