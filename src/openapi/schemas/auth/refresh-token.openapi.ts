import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { refreshTokenSchema as baseSchema } from '../../../modules/auth/dto/refresh-token.schema';

extendZodWithOpenApi(z);

export const refreshTokenOpenApiSchema = baseSchema.extend({
  fingerprint: baseSchema.shape.fingerprint.openapi({
    description: 'Уникальный отпечаток устройства',
    example: 'device-abc-123',
  }),
}).openapi('RefreshTokenDto');
