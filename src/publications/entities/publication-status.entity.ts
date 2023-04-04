/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  Column,
  CreateDateColumn,
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

  @ManyToOne(() => Publication, (publication) => publication.statuses)
  publication: Publication;
}
