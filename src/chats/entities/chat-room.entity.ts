import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChatMessage } from './chat-message.entity';

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

  @ManyToMany(() => User, { eager: true, cascade: true })
  @JoinTable({
    synchronize: false,
    name: 'chat_member',
    joinColumn: { name: 'roomId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  members: User[];
  @OneToOne(() => ChatMessage, { eager: true, nullable: true })
  @JoinColumn({ name: 'lastMessageId' })
  lastMessage: ChatMessage;
}
