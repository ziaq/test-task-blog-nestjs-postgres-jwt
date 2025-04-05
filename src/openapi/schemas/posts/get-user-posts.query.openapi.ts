import { z } from 'zod';

import { getUserPostsQuerySchema as baseSchema } from '../../../modules/posts/dto/get-user-posts.query.schema';

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const getUserPostsQueryOpenApiSchema = baseSchema
  .extend({
    limit: baseSchema.shape.limit.openapi({
      description: 'Максимальное количество постов для получения',
      example: 10,
    }),
    offset: baseSchema.shape.offset.openapi({
      description: 'Смещение для пагинации',
      example: 0,
    }),
    sort: baseSchema.shape.sort.openapi({
      description: 'Сортировка по дате создания',
      example: 'DESC',
    }),
  })
  .openapi('GetUserPostsQueryDto');
