import { Media } from 'src/media/entities/media.entity';
import { UserAddress } from 'src/users/entities/user-address';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

type PublicationMeta = {
  pageSize: 'a4' | 'a5';
  numColorPages: number;
  numBwPages: number;
  numPrints: number;
  publicationPackage: string;
};

@Entity()
export class Publication {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column({ type: 'enum', enum: ['indie', 'selfpub'], nullable: true })
  type: 'indie' | 'selfpub' | null;
  @Column({ type: 'varchar', length: 255 })
  title: string;
  @Column({ type: 'varchar', length: 255, default: '' })
  author: string;
  @Column({ type: 'int', nullable: true })
  coverId: number;
  @Column({ type: 'int', default: 0 })
  royalty: number;
  @Column({ type: 'int', nullable: true })
  addressId: number;
  @Column({ type: 'int', nullable: true })
  shipmentId: number;
  @Column({ type: 'int', nullable: true })
  orderId: number;
  @Column({ type: 'json', default: {} })
  meta: any;
  @Column({
    type: 'enum',
    enum: [
      'draft',
      'payment',
      'approval',
      'publishing',
      'shipment',
      'published',
    ],
    default: 'draft',
  })
  status:
    | 'draft'
    | 'payment'
    | 'verification'
    | 'publishing'
    | 'shipping'
    | 'published';
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => Media, { eager: true, nullable: true })
  cover: Media;
  @ManyToOne(() => UserAddress, { nullable: true })
  address: UserAddress;
  @ManyToOne(() => User, { eager: true })
  user: User;
}
