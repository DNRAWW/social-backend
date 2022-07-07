import { Type } from 'class-transformer';
import { IsDateString, IsOptional, Length } from 'class-validator';

export class CreateUserDto {
  @Length(2, 100)
  firstName: string;

  @Length(2, 100)
  lastName: string;

  @IsDateString()
  dateOfBirth: Date;

  @Length(2, 100)
  city: string;

  @IsOptional()
  @Length(2, 100)
  description: string | null;

  @Length(5, 100)
  login: string;

  @Length(8, 100)
  password: string;
}
