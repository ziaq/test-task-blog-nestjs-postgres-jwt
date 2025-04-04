import { z } from 'zod';

import { postsResponseSchema as baseSchema } from '../../../modules/posts/dto/posts-response.schema';

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const postsResponseOpenApiSchema =
  baseSchema.openapi('PostsResponseDto');
