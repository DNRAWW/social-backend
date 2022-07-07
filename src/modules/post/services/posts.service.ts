import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSubscriptionsService } from '../../user/services/userSubscriptions.service';
import { In, Repository } from 'typeorm';
import { CreatePostDto } from '../DTO/createPost.dto';
import { PostUpdateDto } from '../DTO/postUpdate.dto';
import { PostEntity } from '../entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly repository: Repository<PostEntity>,
    @Inject(UserSubscriptionsService)
    private readonly userSubscriptionsService: UserSubscriptionsService,
  ) {}

  async create(userId: number, post: CreatePostDto) {
    await this.repository.save({
      creatorId: userId,
      ...post,
    });

    return true;
  }

  async update(userId: number, post: PostUpdateDto) {
    const postToUpdate = await this.repository.findOne({
      where: {
        id: post.id,
      },
    });

    if (post == null) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    if (postToUpdate.creatorId !== userId) {
      throw new HttpException(
        'You are not the creator',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.repository.save(post);

    return true;
  }

  async delete(userId: number, postId: number) {
    const postToDelete = await this.repository.findOne({
      where: {
        id: postId,
      },
    });

    if (postToDelete == null) {
      throw new HttpException('Post does not exist', HttpStatus.NOT_FOUND);
    }

    if (userId !== postToDelete.creatorId) {
      throw new HttpException(
        'You are not the creator',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.repository.delete(postId);

    return true;
  }

  async findByUserIds(userIds: number[]) {
    const posts = await this.repository.find({
      where: {
        creatorId: In(userIds),
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return posts;
  }

  async subscriptionsPosts(userId: number) {
    const subscriptions =
      await this.userSubscriptionsService.findSubscriptionsByUser(userId);

    const posts = await this.findByUserIds(subscriptions);

    return posts;
  }
}
