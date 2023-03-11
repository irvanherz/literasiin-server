import { Media } from 'src/media/entities/media.entity';
import { Story } from 'src/stories/entities/story.entity';
import { Wallet } from 'src/wallets/entities/wallet.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Identity } from './identity.entity';
import { PasswordResetToken } from './password-reset-token.entity';

type GenderType = 'male' | 'female' | 'other';
type RoleType = 'user' | 'admin' | 'super';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;
  @Column({ type: 'varchar', length: 255, unique: true })
  username?: string;
  @Column({ type: 'int', nullable: true })
  photoId?: number;
  @Column({ type: 'varchar', length: 255, nullable: true })
  fullName?: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  bio?: string;
  @Column({ type: 'date', nullable: true })
  dob?: Date;
  @Column({ type: 'enum', enum: ['male', 'female', 'other'], nullable: true })
  gender?: GenderType;
  @Column({ type: 'enum', enum: ['user', 'admin', 'super'], default: 'user' })
  role: RoleType;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Identity, (identity) => identity.user)
  identities: Identity[];
  @OneToMany(() => PasswordResetToken, (prt) => prt.user)
  passwordResetTokens: PasswordResetToken[];
  @OneToMany(() => Story, (story) => story.user)
  stories: Story[];
  @ManyToMany(() => User, (user) => user.following)
  followers: User[];
  @ManyToMany(() => User, (user) => user.followers)
  @JoinTable({
    name: 'user_follow',
    synchronize: false,
    joinColumn: { name: 'followerId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'followingId', referencedColumnName: 'id' },
  })
  following: User[];
  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets: Wallet[];
  @OneToOne(() => Media)
  @JoinColumn()
  photo: Media;
}
