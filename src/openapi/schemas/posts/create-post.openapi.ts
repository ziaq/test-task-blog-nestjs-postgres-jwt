import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { createPostSchema as baseSchema } from '../../../modules/posts/dto/create-post.schema';

extendZodWithOpenApi(z);

export const createPostOpenApiSchema = baseSchema.extend({
  text: baseSchema.shape.text.openapi({
    description: 'Текст поста',
    example: 'Привет, это мой первый пост!',
  }),
}).openapi('CreatePostDto');