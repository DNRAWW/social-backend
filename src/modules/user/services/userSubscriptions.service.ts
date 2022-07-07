import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSubscriptionEntity } from '../entities/userSubscription.entity';

@Injectable()
export class UserSubscriptionsService {
  constructor(
    @InjectRepository(UserSubscriptionEntity)
    private readonly repository: Repository<UserSubscriptionEntity>,
  ) {}

  async subscribe(subscriberId: number, subscribedToId: number) {
    const subscription = await this.repository.findOne({
      where: {
        subscriberId: subscriberId,
        subscribedToId: subscribedToId,
      },
    });

    if (subscription == null) {
      await this.repository.save({
        subscriberId: subscriberId,
        subscribedToId: subscribedToId,
      });

      return true;
    }

    throw new HttpException('Already subscribed', HttpStatus.NOT_ACCEPTABLE);
  }

  async unSubscribe(subscriberId: number, subscribedToId: number) {
    const subscription = await this.repository.findOne({
      where: {
        subscriberId: subscriberId,
        subscribedToId: subscribedToId,
      },
    });

    if (subscription == null) {
      throw new HttpException('Not subscribed', HttpStatus.NOT_ACCEPTABLE);
    }

    await this.repository.delete(subscription.id);

    return true;
  }

  async isSubscribed(subscriberId: number, subscribedToId: number) {
    const subscription = await this.repository.findOne({
      where: {
        subscriberId: subscriberId,
        subscribedToId: subscribedToId,
      },
    });

    if (subscription == null) {
      return false;
    }

    return true;
  }

  async isMutuallySubscribed(userId1: number, userId2: number) {
    const mutualSubscription = await this.repository.find({
      where: [
        {
          subscriberId: userId1,
          subscribedToId: userId2,
        },
        {
          subscriberId: userId2,
          subscribedToId: userId1,
        },
      ],
    });

    if (mutualSubscription.length < 2) {
      return false;
    }

    this.findSubscriptionsByUser(userId1);

    return true;
  }

  async findSubscriptionsByUser(userId: number) {
    const subscriptions = await this.repository.find({
      where: {
        subscriberId: userId,
      },
      select: {
        subscribedToId: true,
      },
    });

    const ids = subscriptions.map(
      (subscription) => subscription.subscribedToId,
    );

    return ids;
  }
}
