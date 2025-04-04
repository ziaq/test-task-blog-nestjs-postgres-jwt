import { z } from 'zod';

import { loginSchema as baseSchema } from '../../../modules/auth/dto/login.schema';

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const loginOpenApiSchema = baseSchema
  .extend({
    email: baseSchema.shape.email.openapi({
      description: 'Email пользователя',
      example: 'user@example.com',
    }),
    password: baseSchema.shape.password.openapi({
      description: 'Пароль',
      example: '12345678',
    }),
    fingerprint: baseSchema.shape.fingerprint.openapi({
      description: 'Отпечаток браузера или устройства',
      example: 'a1b2c3d4e5',
    }),
  })
  .openapi('LoginDto');
