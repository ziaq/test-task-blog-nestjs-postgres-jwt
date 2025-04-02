import { z } from 'zod';

export const updatePostSchema = z
  .object({
    text: z.string().min(1).max(10_000).optional(),
    deleteImageIds: z.preprocess((val) => {
      if (typeof val !== 'string') {
        throw new Error('deleteImageIds must be a stringified array');
      }

      const parsed = JSON.parse(val);
      if (!Array.isArray(parsed)) {
        throw new Error('deleteImageIds must be an array');
      }

      return parsed;
    }, z.array(z.number())).optional(),
  })
  .strict();

export type UpdatePostDto = z.infer<typeof updatePostSchema>;