import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WalletTransaction } from './wallet-transaction.entity';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column({ type: 'decimal', precision: 20, scale: 2, default: 0 })
  balance: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => WalletTransaction, (trx) => trx.wallet)
  transactions: WalletTransaction[];
  @ManyToOne(() => User, (user) => user.wallets, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: User;
}
