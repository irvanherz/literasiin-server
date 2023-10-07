import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Wallet } from './wallet.entity';

@Entity()
export class WalletWithdrawal {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  walletId: number;
  @Column({
    type: 'enum',
    enum: ['requested', 'rejected', 'canceled', 'processing', 'completed'],
    default: 'requested',
  })
  status: 'requested' | 'rejected' | 'canceled' | 'processing' | 'completed';
  @Column({ type: 'decimal', precision: 20, scale: 2, default: 0 })
  amount: number;
  @Column({ type: 'text', default: null })
  note: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  wallet: Wallet;
}
