import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'int', unique: true })
  userId: number;
  @Column({ type: 'varchar', length: 255, nullable: true })
  bio: string;
  @Column({ type: 'varchar', length: 255 })
  email: string;
  @Column({ type: 'varchar', length: 50, array: true, default: [] })
  phones: string[];
  @Column({ type: 'varchar', length: 255, default: null })
  facebook: string;
  @Column({ type: 'varchar', length: 255, default: null })
  twitter: string;
  @Column({ type: 'varchar', length: 255, default: null })
  instagram: string;
  @Column({ type: 'varchar', length: 255, array: true, default: [] })
  websites: string[];
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
