import { z } from 'zod';

export const createPostSchema = z.object({
  text: z.string().min(1),
});

export type CreatePostDto = z.infer<typeof createPostSchema>;