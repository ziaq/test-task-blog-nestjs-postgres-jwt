import { z } from 'zod';

import { createUserSchema as baseSchema } from '../../../modules/users/dto/create-user.schema';

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const createUserOpenApiSchema = baseSchema
  .extend({
    email: baseSchema.shape.email.openapi({
      description: 'Email пользователя',
      example: 'user@example.com',
    }),
    password: baseSchema.shape.password.openapi({
      description: 'Пароль',
      example: 'qwerty123',
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
      description: 'Телефон',
      example: '+79991112233',
    }),
    birthDate: baseSchema.shape.birthDate?.openapi({
      description: 'Дата рождения',
      example: '1990-01-01T00:00:00.000Z',
    }),
    about: baseSchema.shape.about?.openapi({
      description: 'О себе',
      example: 'Frontend разработчик',
    }),
  })
  .openapi('CreateUserDto');
