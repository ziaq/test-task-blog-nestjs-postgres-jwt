import { User } from '../entities/user.entity';
import { userResponseSchema, UserResponseDto } from '../dto/user-response.schema';

export function sanitizeUser(user: User): UserResponseDto {
  const safeUser = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    birthDate: user.birthDate,
    about: user.about,
    avatar: user.avatar,
  };

  return userResponseSchema.parse(safeUser);
}
