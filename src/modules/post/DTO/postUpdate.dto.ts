import { Type } from 'class-transformer';
import { IsOptional, Length, Min } from 'class-validator';

export class PostUpdateDto {
  @Type(() => Number)
  @Min(1)
  id: number;

  @IsOptional()
  @Length(10, 1000)
  text: string;

  @IsOptional()
  @Length(2, 200)
  title: string;
}
