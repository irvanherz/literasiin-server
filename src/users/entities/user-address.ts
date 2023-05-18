import { Point } from 'geojson';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserAddress {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'int' })
  userId: number;
  @Column({ type: 'varchar', length: 50 })
  type: string;
  @Column({ type: 'int' })
  postalCode: string;
  @Column({ type: 'point' })
  location: Point;
  @Column({ type: 'varchar', length: 255 })
  address: string;
  @Column({ type: 'varchar', length: 50 })
  phone?: any;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt?: Date;
  @ManyToOne(() => User, (user) => user.identities, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: User;
}
