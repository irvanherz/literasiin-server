import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Waiter {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;
  @CreateDateColumn()
  createdAt: Date;
}
