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
  @Column({ type: 'int' })
  userId: number;
  @Column({ type: 'decimal', precision: 10, scale: 4, default: 0 })
  amount: number;
  @Column({ type: 'json', default: {} })
  meta: any;
  @Column({
    type: 'enum',
    enum: ['unpaid', 'pending', 'paid', 'expired', 'canceled'],
    default: 'unpaid',
  })
  status: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
