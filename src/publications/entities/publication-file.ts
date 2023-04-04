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
export class PublicationFile {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  publicationId: number;
  @Column({ type: 'varchar', length: 255 })
  name: string;
  @Column({ type: 'json', default: {} })
  meta: any;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Publication, (publication) => publication.statuses)
  publication: Publication;
}
