import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('user_subscriptions')
@Unique('unique_subscription_constraint', ['subscriberId', 'subscribedToId'])
export class UserSubscriptionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  subscriberId: number;

  @ManyToOne(() => UserEntity)
  subscriber: UserEntity;

  @Column()
  subscribedToId: number;

  @ManyToOne(() => UserEntity)
  subscribedTo: UserEntity;
}
