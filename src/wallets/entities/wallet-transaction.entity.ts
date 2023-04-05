import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Wallet } from './wallet.entity';

@Entity()
export class WalletTransaction {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  walletId: number;
  @Column({ type: 'enum', enum: ['C', 'D'] })
  type: 'C' | 'D';
  @Column({ type: 'decimal', precision: 20, scale: 2, default: 0 })
  amount: number;
  @Column({ type: 'decimal', precision: 20, scale: 2, default: 0 })
  finalBalance: number;
  @Column({ type: 'text', default: null })
  description: string;
  @Column({ type: 'json', default: {} })
  meta: any;
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  wallet: Wallet;
}
