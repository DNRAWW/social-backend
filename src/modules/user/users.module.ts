import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { UserEntity } from './entities/user.entity';
import { UserSubscriptionEntity } from './entities/userSubscription.entity';
import { TokenService } from './services/token.service';
import { UsersService } from './services/users.service';
import { UserSubscriptionsService } from './services/userSubscriptions.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserSubscriptionEntity])],
  controllers: [UsersController],
  providers: [UsersService, TokenService, UserSubscriptionsService],
  exports: [UsersService, TokenService, UserSubscriptionsService],
})
export class UsersModule {}
