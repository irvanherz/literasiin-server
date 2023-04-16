import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 255, unique: true })
  code: string;
  @Column({ type: 'decimal', precision: 20, scale: 2, default: 0 })
  amount: number;
  @Column({
    type: 'enum',
    enum: ['unpaid', 'pending', 'paid', 'challenge', 'failed', 'canceled'],
    default: 'unpaid',
  })
  status: 'unpaid' | 'pending' | 'paid' | 'challenge' | 'failed' | 'canceled';
  @Column({ type: 'json', default: {} })
  meta: any;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @OneToMany(() => Order, (order) => order.payment)
  orders: Order[];
}
