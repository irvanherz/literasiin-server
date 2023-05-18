/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PublicationStatus {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  publicationId: number;
  @Column({ type: 'varchar', length: 50, default: 'created' })
  type: string;
  @Column({ type: 'json', default: {} })
  meta: any;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
