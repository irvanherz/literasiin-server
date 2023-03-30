import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'enum', enum: ['personal', 'group'], default: 'personal' })
  type: 'personal' | 'group';
  @Column({ type: 'varchar', length: 50, nullable: true })
  title: string;
  @Column({ type: 'int', nullable: true })
  lastMessageId: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => User, { eager: true })
  @JoinTable({
    synchronize: false,
    name: 'chat_member',
    joinColumn: { name: 'roomId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  members: User[];
}
