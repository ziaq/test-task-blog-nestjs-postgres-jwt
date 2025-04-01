import { z } from 'zod';

export const updatePostSchema = z.object({
  text: z.string().min(1).optional(),
  deleteImageIds: z.array(z.number()).optional(),
});

export type UpdatePostDto = z.infer<typeof updatePostSchema>;