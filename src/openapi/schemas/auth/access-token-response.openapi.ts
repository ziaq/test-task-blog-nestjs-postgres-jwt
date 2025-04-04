import { z } from 'zod';

import { accessTokenResponseSchema as baseSchema } from '../../../modules/auth/dto/access-token-response.schema';

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const accessTokenResponseSchema = baseSchema
  .extend({
    accessToken: baseSchema.shape.accessToken.openapi({
      description: 'JWT Access токен',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }),
  })
  .openapi('LoginResponseDto');
