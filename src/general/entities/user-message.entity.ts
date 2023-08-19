import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserMessage {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 255, nullable: true })
  firstName: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  lastName: string;
  @Column({ type: 'varchar', length: 300, nullable: true })
  email: string;
  @Column({ type: 'varchar', length: 50, nullable: true })
  phone?: string;
  @Column({ type: 'text', nullable: true })
  message: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt?: Date;
}
