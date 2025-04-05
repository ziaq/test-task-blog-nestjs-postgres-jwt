import { registry } from '../../registry';

export function registerAuthRegisterPath() {
  registry.registerPath({
    method: 'post',
    path: '/auth/register',
    summary: 'Регистрация нового пользователя',
    tags: ['Auth'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/RegisterDto' },
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Пользователь успешно зарегистрирован',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UserResponseDto' },
          },
        },
      },
      400: {
        description: 'Невалидные данные',
      },
      409: {
        description: 'Пользователь с таким email уже существует',
      },
    },
  });
}
