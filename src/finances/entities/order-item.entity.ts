import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'int' })
  orderId: number;
  @Column({ type: 'enum', enum: ['book', 'coin', 'fee'] })
  type: 'book' | 'coin' | 'fee';
  @Column({ type: 'int' })
  qty: number;
  @Column({ type: 'decimal', precision: 20, scale: 2, default: 0 })
  unitPrice: number;
  @Column({ type: 'decimal', precision: 20, scale: 2, default: 0 })
  amount: number;
  @Column({ type: 'json', default: {} })
  meta: any;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @ManyToOne(() => Order, (order) => order.items)
  order: Order;
}
