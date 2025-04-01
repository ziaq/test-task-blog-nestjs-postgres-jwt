import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fingerprint: z.string().min(1),
});

export type LoginDto = z.infer<typeof loginSchema>;