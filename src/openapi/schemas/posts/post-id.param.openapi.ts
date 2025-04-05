import { z } from 'zod';

import { postIdParamSchema as baseSchema } from '../../../modules/posts/dto/post-id.param.schema';

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const postIdParamOpenApiSchema = baseSchema
  .extend({
    id: baseSchema.shape.id.openapi({
      description: 'ID поста',
      example: 42,
    }),
  })
  .openapi('PostIdParamDto');
