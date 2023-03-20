import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['chapterId', 'userId'])
export class ChapterReader {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  chapterId: number;
  @Column()
  userId: number;
  @Column({ type: 'int', default: 0 })
  vote: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt?: Date;
}
