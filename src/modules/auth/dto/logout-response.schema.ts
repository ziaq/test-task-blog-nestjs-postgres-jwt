import { z } from 'zod';

export const logoutResponseSchema = z.object({
  message: z.string(),
});

export type LogoutResponseDto = z.infer<typeof logoutResponseSchema>;