import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 255 })
  code: string;
  @Column()
  userId: number;
  @Column({ type: 'decimal', precision: 20, scale: 2, default: 0 })
  amount: number;
  @Column({ type: 'json', default: {} })
  meta: any;
  @Column({
    type: 'enum',
    enum: ['deposit', 'payment'],
  })
  type: 'deposit' | 'payment';
  @Column({
    type: 'enum',
    enum: ['unpaid', 'pending', 'paid', 'challenge', 'failed', 'canceled'],
    default: 'unpaid',
  })
  status: 'unpaid' | 'pending' | 'paid' | 'challenge' | 'failed' | 'canceled';
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
