import { Type } from 'class-transformer';
import { Min } from 'class-validator';

export class ActionByIdDto {
  @Type(() => Number)
  @Min(1)
  id: number;
}
