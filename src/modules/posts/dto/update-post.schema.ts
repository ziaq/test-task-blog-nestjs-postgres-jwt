import { z } from 'zod';

export const updatePostSchema = z
  .object({
    text: z.string().min(1).max(10_000).optional(),
    deleteImageIds: z
      .preprocess((val) => {
        if (typeof val !== 'string') return undefined;

        try {
          return JSON.parse(val) as unknown;
        } catch {
          return undefined;
        }
      }, z.array(z.number()))
      .optional(),
  })
  .strict();

export type UpdatePostDto = z.infer<typeof updatePostSchema>;
