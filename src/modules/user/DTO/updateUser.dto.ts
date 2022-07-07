import { Type } from 'class-transformer';
import { IsDateString, IsOptional, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @Length(2, 100)
  firstName: string;

  @IsOptional()
  @Length(2, 100)
  lastName: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth: Date;

  @IsOptional()
  @Length(2, 100)
  city: string;

  @IsOptional()
  @Length(0, 100)
  description: string | null;

  @IsOptional()
  @Length(5, 100)
  login: string;

  @IsOptional()
  @Length(8, 100)
  password: string;
}
