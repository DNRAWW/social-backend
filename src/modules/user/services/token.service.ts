import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import * as jwt from 'jsonwebtoken';
import { UserJwtTokenDto } from '../DTO/userJwtToken.dto';

@Injectable()
export class TokenService {
  genToken(user: UserEntity): string {
    return jwt.sign({ id: user.id }, 'secret');
  }

  verifyToken(token: string): UserJwtTokenDto {
    try {
      return <UserJwtTokenDto>jwt.verify(token, 'secret');
    } catch {
      throw new HttpException('Token is invalid', HttpStatus.UNAUTHORIZED);
    }
  }
}
