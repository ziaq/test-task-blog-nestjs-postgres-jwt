import { z } from 'zod';

export const accessTokenResponseSchema = z.object({
  accessToken: z.string(),
});

export type AccessTokenResponseDto = z.infer<typeof accessTokenResponseSchema>;