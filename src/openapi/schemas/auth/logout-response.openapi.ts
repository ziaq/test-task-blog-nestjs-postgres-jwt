import { z } from 'zod';

import { logoutResponseSchema as baseSchema } from '../../../modules/auth/dto/logout-response.schema';

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const logoutResponseOpenApiSchema = baseSchema
  .extend({
    message: baseSchema.shape.message.openapi({
      description: 'Сообщение об успешном выходе',
      example: 'Logged out successfully',
    }),
  })
  .openapi('LogoutResponseDto');
