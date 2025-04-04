import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

import { logoutResponseSchema as baseSchema } from '../../../modules/auth/dto/logout-response.schema';

extendZodWithOpenApi(z);

export const logoutResponseOpenApiSchema = baseSchema
  .extend({
    message: baseSchema.shape.message.openapi({
      description: 'Сообщение об успешном выходе',
      example: 'Logged out successfully',
    }),
  })
  .openapi('LogoutResponseDto');