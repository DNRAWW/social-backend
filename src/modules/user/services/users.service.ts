import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, ILike, In, Repository } from 'typeorm';
import { CreateUserDto } from '../DTO/createUser.dto';
import { UpdateUserDto } from '../DTO/updateUser.dto';
import { UserDto } from '../DTO/user.dto';
import { UserEntity } from '../entities/user.entity';
import { TokenService } from './token.service';
import { UserSubscriptionsService } from './userSubscriptions.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
    @Inject(TokenService)
    private readonly tokenService: TokenService,
    @Inject(UserSubscriptionsService)
    private readonly userSubscriptionsService: UserSubscriptionsService,
  ) {}

  async findOne(userId: number | null = null, id: number) {
    let isMutuallySubscribed = false;

    if (userId && userId !== id) {
      isMutuallySubscribed =
        await this.userSubscriptionsService.isMutuallySubscribed(userId, id);
    }

    let select: FindOptionsSelect<UserEntity> = {
      id: true,
      dateOfBirth: true,
      deletedAt: true,
      firstName: true,
      lastName: true,
    };

    if (isMutuallySubscribed || userId === id) {
      select.city = true;
      select.description = true;
    }

    const result = await this.repository.findOne({
      where: {
        id: id,
      },
      select: select,
    });

    if (result == null) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async findByName(
    userId: number | null = null,
    firstName: string,
    lastName: string,
  ) {
    const result: UserDto = await this.repository.findOne({
      where: {
        firstName: firstName,
        lastName: lastName,
      },
      select: {
        id: true,
        dateOfBirth: true,
        deletedAt: true,
        firstName: true,
        lastName: true,
        city: true,
        description: true,
      },
    });

    if (result == null) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    let isMutuallySubscribed = false;
    let isSubscribed = false;

    if (userId) {
      isSubscribed = await this.userSubscriptionsService.isSubscribed(
        userId,
        result.id,
      );

      if (isSubscribed) {
        isMutuallySubscribed =
          await this.userSubscriptionsService.isMutuallySubscribed(
            userId,
            result.id,
          );
        result.isSubscribed = true;
      }
    }

    if (!isMutuallySubscribed) {
      delete result.city;
      delete result.description;
    }

    return result;
  }

  async login(login: string, password: string) {
    const candidate = await this.repository.findOne({
      where: {
        login: login,
      },
    });

    if (candidate == null) {
      throw new HttpException(
        'Password or login is incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (candidate.password === password) {
      return this.tokenService.genToken(candidate);
    }

    throw new HttpException(
      'Password or login is incorrect',
      HttpStatus.UNAUTHORIZED,
    );
  }

  async create(user: CreateUserDto): Promise<boolean> {
    const userWithLogin = await this.repository.findOne({
      where: {
        login: user.login,
      },
      withDeleted: true,
    });

    if (userWithLogin) {
      throw new HttpException(
        'User with this login already exists',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    await this.repository.save(user);

    return true;
  }

  async delete(id: number) {
    await this.findOne(null, id); // check if user exists

    await this.repository.softDelete(id);

    return true;
  }

  async update(userId: number, changes: UpdateUserDto) {
    await this.repository.save({
      id: userId,
      ...changes,
    });

    return true;
  }
}
