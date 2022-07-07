export class UserDto {
  id: number;

  firstName: string;

  lastName: string;

  dateOfBirth: Date;

  city?: string;

  description?: string | null;

  deletedAt: Date | null;

  isSubscribed?: boolean;
}
