import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../user/users.module';
import { PostsController } from './controllers/posts.controller';
import { PostEntity } from './entities/post.entity';
import { PostsService } from './services/posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity]), UsersModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
