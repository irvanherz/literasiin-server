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
import { Story } from './story.entity';

@Entity()
@Unique(['storyId', 'userId'])
export class StoryWriter {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  storyId: number;
  @Column()
  userId: number;
  @Column({
    type: 'enum',
    enum: ['owner', 'writer', 'mentor'],
    default: 'writer',
  })
  role: 'owner' | 'writer' | 'mentor';
  @Column({
    type: 'enum',
    enum: ['unapproved', 'approved', 'rejected'],
    default: 'unapproved',
  })
  status: 'unapproved' | 'approved' | 'rejected';
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt?: Date;
  @ManyToOne(() => Story, { onDelete: 'CASCADE' })
  story: Story;
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;
}
