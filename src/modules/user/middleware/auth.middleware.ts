import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { TokenService } from '../services/token.service';
import { UsersService } from '../services/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
    @Inject(TokenService)
    private readonly tokenService: TokenService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = this.tokenService.verifyToken(req.cookies.authorization);
      const user = await this.usersService.findOne(null, result.id);

      if (user == null) {
        req.body.currentUser = {
          id: null,
        };

        next();
      }

      req.body.currentUser = {
        id: result.id,
      };
    } catch {
      req.body.currentUser = {
        id: null,
      };
    }

    next();
  }
}
