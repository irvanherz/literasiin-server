import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WalletTransaction } from './wallet-transaction.entity';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'int', unique: true })
  userId: number;
  @Column({ type: 'decimal', precision: 10, scale: 4, default: 0 })
  balance: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => WalletTransaction, (trx) => trx.wallet)
  transactions: WalletTransaction[];
  @OneToOne(() => User, (user) => user.wallet)
  user: User;
}
