import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { User } from 'src/modules/common/decorators/user.decoratoor';
import { ActionByIdDto } from 'src/modules/common/DTO/actionById.dto';
import { CreateUserDto } from '../DTO/createUser.dto';
import { GetByNameDto } from '../DTO/getByName.dto';
import { LoginDto } from '../DTO/login.dto';
import { UpdateUserDto } from '../DTO/updateUser.dto';
import { UserDto } from '../DTO/user.dto';
import { UserJwtTokenDto } from '../DTO/userJwtToken.dto';
import { AuthGuard } from '../guards/auth.guard';
import { UsersService } from '../services/users.service';
import { UserSubscriptionsService } from '../services/userSubscriptions.service';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
    @Inject(UserSubscriptionsService)
    private readonly userSubscriptionsService: UserSubscriptionsService,
  ) {}

  @Get('by-id/:id')
  async getOne(
    @User() user: UserJwtTokenDto,
    @Param() params: ActionByIdDto,
  ): Promise<UserDto> {
    return await this.usersService.findOne(user.id, params.id);
  }

  @Get('by-name')
  async getByName(
    @User() user: UserJwtTokenDto,
    @Query() params: GetByNameDto,
  ): Promise<UserDto> {
    return await this.usersService.findByName(
      user.id,
      params.firstName,
      params.lastName,
    );
  }

  @Post()
  async register(@Body() body: CreateUserDto): Promise<boolean> {
    return await this.usersService.create(body);
  }

  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() body: LoginDto,
  ): Promise<void> {
    const token = await this.usersService.login(body.login, body.password);

    res.cookie('authorization', token);
  }

  @Put()
  @UseGuards(AuthGuard)
  async update(
    @User() user: UserJwtTokenDto,
    @Body() body: UpdateUserDto,
  ): Promise<boolean> {
    return await this.usersService.update(user.id, body);
  }

  @Delete()
  @UseGuards(AuthGuard)
  async delete(@User() user: UserJwtTokenDto): Promise<boolean> {
    return await this.usersService.delete(user.id);
  }

  @Post('subscribe')
  @UseGuards(AuthGuard)
  async subscribe(
    @User() user: UserJwtTokenDto,
    @Body() params: ActionByIdDto,
  ): Promise<boolean> {
    if (user.id === params.id) {
      throw new HttpException(
        "Can't subscribe to yourself",
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    await this.usersService.findOne(null, params.id); // check if user exists

    return await this.userSubscriptionsService.subscribe(user.id, params.id);
  }

  @Post('unsubscribe')
  @UseGuards(AuthGuard)
  async unsubscribe(
    @User() user: UserJwtTokenDto,
    @Body() params: ActionByIdDto,
  ): Promise<boolean> {
    if (user.id === params.id) {
      throw new HttpException(
        "Can't unsubscribe from yourself",
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    await this.usersService.findOne(null, params.id); // check if user exists

    return await this.userSubscriptionsService.unSubscribe(user.id, params.id);
  }
}
