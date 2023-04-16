import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { Payment } from './payment.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column({ type: 'int', nullable: true })
  paymentId: number | null;
  @Column({ type: 'decimal', precision: 20, scale: 2, default: 0 })
  amount: number;
  @Column({ type: 'json', default: {} })
  meta: any;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @ManyToOne(() => Payment, {
    eager: true,
    nullable: true,
  })
  payment: Payment;
  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];
}
