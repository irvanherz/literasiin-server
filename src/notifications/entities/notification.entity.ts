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
  @Column({ type: 'varchar', length: 100 })
  type: string;
  @Column({ type: 'varchar', length: 100 })
  subtype: string;
  @Column({ type: 'json', default: {} })
  meta: any;
  @Column({ type: 'boolean', default: false })
  read: boolean;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
