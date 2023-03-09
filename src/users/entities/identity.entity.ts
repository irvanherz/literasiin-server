import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
@Unique(['userId', 'type'])
export class Identity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'int' })
  userId: number;
  @Column({ type: 'varchar', length: 50 })
  type: string;
  @Column({ type: 'varchar', length: 255 })
  key: string;
  @Column({ type: 'json', nullable: true })
  meta?: any;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt?: Date;
  @ManyToOne(() => User, (user) => user.identities)
  user: User;
}
