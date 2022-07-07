import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/modules/common/decorators/user.decoratoor';
import { ActionByIdDto } from 'src/modules/common/DTO/actionById.dto';
import { UserJwtTokenDto } from 'src/modules/user/DTO/userJwtToken.dto';
import { AuthGuard } from 'src/modules/user/guards/auth.guard';
import { CreatePostDto } from '../DTO/createPost.dto';
import { PostUpdateDto } from '../DTO/postUpdate.dto';
import { PostEntity } from '../entities/post.entity';
import { PostsService } from '../services/posts.service';

@Controller('posts')
export class PostsController {
  constructor(
    @Inject(PostsService)
    private readonly postsService: PostsService,
  ) {}

  @Get('/subscriptions-posts')
  @UseGuards(AuthGuard)
  async getSubscrtiptionPosts(
    @User() user: UserJwtTokenDto,
  ): Promise<PostEntity[]> {
    return await this.postsService.subscriptionsPosts(user.id);
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @User() user: UserJwtTokenDto,
    @Body() body: CreatePostDto,
  ): Promise<boolean> {
    return await this.postsService.create(user.id, body);
  }

  @Put()
  @UseGuards(AuthGuard)
  async update(
    @User() user: UserJwtTokenDto,
    @Body() body: PostUpdateDto,
  ): Promise<boolean> {
    return await this.postsService.update(user.id, body);
  }

  @Delete()
  @UseGuards(AuthGuard)
  async delete(
    @User() user: UserJwtTokenDto,
    @Body() body: ActionByIdDto,
  ): Promise<boolean> {
    return await this.postsService.delete(user.id, body.id);
  }
}
