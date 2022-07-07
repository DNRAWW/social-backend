import { Length } from 'class-validator';

export class LoginDto {
  @Length(1, 100)
  login: string;

  @Length(1, 100)
  password: string;
}
