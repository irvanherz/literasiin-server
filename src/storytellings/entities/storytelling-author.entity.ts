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
export class StorytellingAuthor {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  storytellingId: number;
  @Column()
  userId: number;
  @Column({
    type: 'enum',
    enum: ['owner', 'contributor', 'mentor'],
    default: 'contributor',
  })
  role: 'owner' | 'contributor' | 'mentor';
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
  @ManyToOne(() => Storytelling, { onDelete: 'CASCADE' })
  storytelling: Storytelling;
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;
}
