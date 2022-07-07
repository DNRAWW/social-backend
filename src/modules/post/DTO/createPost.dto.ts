import { Length } from 'class-validator';

export class CreatePostDto {
  @Length(10, 1000)
  text: string;

  @Length(2, 200)
  title: string;
}
