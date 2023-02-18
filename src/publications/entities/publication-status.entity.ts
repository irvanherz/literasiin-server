/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Publication } from './publication.entity';

@Entity()
export class PublicationStatus {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: 'enum',
    enum: ['accept', 'edit', 'reject', 'final', 'print'],
  })
  type: string = 'accept';
  @Column()
  publicationId: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => Publication, (publication) => publication.statuses)
  publication: Publication;
}
