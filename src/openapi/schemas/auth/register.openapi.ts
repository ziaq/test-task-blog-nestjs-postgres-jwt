import { z } from 'zod';

import { registerSchema as baseSchema } from '../../../modules/auth/dto/register.schema';

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const registerOpenApiSchema = baseSchema
  .extend({
    email: baseSchema.shape.email.openapi({
      description: 'Email пользователя',
      example: 'ivan@example.com',
    }),
    password: baseSchema.shape.password.openapi({
      description: 'Пароль',
      example: 'secret123',
    }),
    firstName: baseSchema.shape.firstName.openapi({
      description: 'Имя',
      example: 'Иван',
    }),
    lastName: baseSchema.shape.lastName.openapi({
      description: 'Фамилия',
      example: 'Петров',
    }),
    phone: baseSchema.shape.phone?.openapi({
      description: 'Номер телефона',
      example: '+79998887766',
    }),
    birthDate: baseSchema.shape.birthDate?.openapi({
      description: 'Дата рождения',
      example: '2000-01-01T00:00:00.000Z',
    }),
    about: baseSchema.shape.about?.openapi({
      description: 'О себе',
      example: 'React frontend developer',
    }),
  })
  .openapi('RegisterDto');
