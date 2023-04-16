import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PublicationFile } from './publication-file';
import { PublicationStatus } from './publication-status.entity';
import { Publisher } from './publisher.entity';

@Entity()
export class Publication {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column({ type: 'int', nullable: true })
  publisherId: number;
  @Column({ type: 'varchar', length: 255 })
  title: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  author: string;
  @Column({ type: 'varchar', length: 500, nullable: true })
  address: string;
  @Column({ type: 'enum', enum: ['a4', 'a5'], nullable: true })
  size: string;
  @Column({
    type: 'enum',
    enum: ['draft', 'process', 'published'],
    default: 'draft',
  })
  status: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => Publisher, { eager: true, nullable: true })
  publisher: Publisher;
  @ManyToOne(() => User, { eager: true })
  user: User;
  @OneToMany(() => PublicationStatus, (status) => status.publication)
  statuses: PublicationStatus[];
  @OneToMany(() => PublicationFile, (file) => file.publication)
  files: PublicationStatus[];
}
