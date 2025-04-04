import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { postsResponseSchema as baseSchema } from '../../../modules/posts/dto/posts-response.schema';

extendZodWithOpenApi(z);

export const postsResponseOpenApiSchema = baseSchema.openapi('PostsResponseDto');
