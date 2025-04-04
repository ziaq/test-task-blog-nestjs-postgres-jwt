import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().optional(),
  birthDate: z.coerce.date().optional(),
  about: z.string().optional(),
}).strict();

export type CreateUserDto = z.infer<typeof createUserSchema>;
