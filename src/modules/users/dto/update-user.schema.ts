import { z } from 'zod';

export const updateUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  birthDate: z.string().datetime().optional(),
  about: z.string().optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;