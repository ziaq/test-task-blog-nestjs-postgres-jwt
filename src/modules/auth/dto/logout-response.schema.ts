import { z } from 'zod';

export const logoutResponseSchema = z.object({
  message: z.string(),
}).strict();

export type LogoutResponseDto = z.infer<typeof logoutResponseSchema>;