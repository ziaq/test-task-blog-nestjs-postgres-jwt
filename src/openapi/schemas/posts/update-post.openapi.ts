import { z } from 'zod';

import { updatePostSchema as baseSchema } from '../../../modules/posts/dto/update-post.schema';

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const updatePostOpenApiSchema = baseSchema
  .extend({
    text: baseSchema.shape.text?.openapi({
      description: 'Обновлённый текст поста',
      example: 'Теперь я обновил этот пост!',
    }),
    deleteImageIds: baseSchema.shape.deleteImageIds?.openapi({
      description: 'JSON-массив ID изображений, которые нужно удалить',
      example: '[1, 2, 3]',
    }),
  })
  .openapi('UpdatePostDto');
