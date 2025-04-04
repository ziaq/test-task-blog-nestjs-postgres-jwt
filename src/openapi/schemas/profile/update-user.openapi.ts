import { z } from 'zod';

import { updateUserSchema as baseSchema } from '../../../modules/users/dto/update-user.schema';

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const updateUserOpenApiSchema = baseSchema
  .extend({
    firstName: baseSchema.shape.firstName.openapi({
      description: 'Имя пользователя',
      example: 'Иван',
    }),
    lastName: baseSchema.shape.lastName.openapi({
      description: 'Фамилия пользователя',
      example: 'Петров',
    }),
    phone: baseSchema.shape.phone.openapi({
      description: 'Номер телефона',
      example: '+79998887766',
    }),
    birthDate: baseSchema.shape.birthDate?.openapi({
      description: 'Дата рождения',
      example: '2000-01-01T00:00:00.000Z',
    }),
    email: baseSchema.shape.email.openapi({
      description: 'Email',
      example: 'ivan@example.com',
    }),
    about: baseSchema.shape.about.openapi({
      description: 'О себе',
      example: 'Frontend developer',
    }),
  })
  .openapi('UpdateUserDto');
