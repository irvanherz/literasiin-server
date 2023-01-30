import { Story } from 'src/stories/entities/story.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Identity } from './identity.entity';

type GenderType = 'male' | 'female' | 'other';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  fullName?: string;
  @Column({ type: 'date', nullable: true })
  dob?: Date;
  @Column({ type: 'enum', enum: ['male', 'female', 'other'], nullable: true })
  gender?: GenderType;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Identity, (identity) => identity.user)
  identities: Identity[];
  @OneToMany(() => Story, (story) => story.user)
  stories: Story[];
}
