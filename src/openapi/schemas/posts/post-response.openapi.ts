import { z } from 'zod';

import { postResponseSchema as baseSchema } from '../../../modules/posts/dto/post-response.schema';

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const postResponseOpenApiSchema = baseSchema
  .extend({
    id: baseSchema.shape.id.openapi({
      description: 'ID поста',
      example: 42,
    }),
    text: baseSchema.shape.text.openapi({
      description: 'Текст поста',
      example: 'Содержимое поста',
    }),
    createdAt: baseSchema.shape.createdAt.openapi({
      description: 'Дата создания',
      example: '2024-01-01T00:00:00.000Z',
    }),
    updatedAt: baseSchema.shape.updatedAt.openapi({
      description: 'Дата последнего обновления',
      example: '2024-01-01T00:00:00.000Z',
    }),
    images: baseSchema.shape.images.openapi({
      description: 'Массив изображений поста',
    }),
  })
  .openapi('PostResponseDto');
