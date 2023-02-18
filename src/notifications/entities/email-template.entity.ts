import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class EmailTemplate {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;
  @Column({ type: 'varchar', length: 256 })
  subject: string;
  @Column({ type: 'text' })
  html: string;
  @Column({ type: 'text' })
  text: string;
  @Column({ type: 'json', default: {} })
  meta: object;
  @CreateDateColumn()
  createdAt?: Date;
  @UpdateDateColumn()
  updatedAt?: Date;
}
