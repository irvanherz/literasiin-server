import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Revenue {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column({ type: 'varchar', length: 255 })
  type: string;
  @Column({ type: 'decimal', precision: 20, scale: 2, default: 0 })
  amount: number;
  @Column({
    type: 'enum',
    enum: ['unpaid', 'canceled', 'paid'],
    default: 'unpaid',
  })
  status: 'unpaid' | 'canceled' | 'paid';
  @Column({ type: 'json', default: {} })
  meta: any;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
