/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Media } from 'src/media/entities/media.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PublicationFile {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'int' })
  publicationId: number;
  @Column({ type: 'int' })
  mediaId: number;
  @CreateDateColumn()
  createdAt: Date;
  @OneToOne(() => Media, { eager: true })
  @JoinColumn()
  media: Media;
}
