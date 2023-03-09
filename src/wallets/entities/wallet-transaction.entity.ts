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
  @Column({ type: 'int' })
  walletId: number;
  @Column({ type: 'enum', enum: ['C', 'D'] })
  type: 'C' | 'D';
  @Column({ type: 'money' })
  amount: number;
  @Column({ type: 'money' })
  finalBalance: number;
  @Column({ type: 'text', default: true })
  description: number;
  @Column({ type: 'json' })
  meta: any;
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  wallet: Wallet;
}
