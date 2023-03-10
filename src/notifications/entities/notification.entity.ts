import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('int')
  userId: number;
  @Column({ type: 'varchar', length: 50 })
  type: string;
  @Column({ type: 'varchar', length: 50 })
  subType: string;
  @Column({ type: 'json', default: {} })
  meta: any;
  @Column({ type: 'boolean', default: false })
  read: boolean;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
