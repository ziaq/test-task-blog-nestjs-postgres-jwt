import { z } from 'zod';

import { userResponseSchema as baseSchema } from '../../../modules/users/dto/user-response.schema';

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const userResponseOpenApiSchema = baseSchema
  .extend({
    id: baseSchema.shape.id.openapi({
      description: 'ID пользователя',
      example: 1,
    }),
    email: baseSchema.shape.email.openapi({
      description: 'Email',
      example: 'user@example.com',
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
      example: '+79991112233',
    }),
    birthDate: baseSchema.shape.birthDate?.openapi({
      description: 'Дата рождения',
      example: '2000-01-01T00:00:00.000Z',
    }),
    about: baseSchema.shape.about?.openapi({
      description: 'О себе',
      example: 'Frontend разработчик',
    }),
    avatar: baseSchema.shape.avatar?.openapi({
      description: 'Имя файла аватара',
      example: 'avatar123.png',
    }),
  })
  .openapi('UserResponseDto');
