import { registry } from '../../registry';

export function registerAuthLoginPath() {
  registry.registerPath({
    method: 'post',
    path: '/auth/login',
    summary: 'Аутентификация пользователя',
    tags: ['Auth'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/LoginDto' },
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Успешный вход',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/AccessTokenResponseDto' },
          },
        },
      },
      400: {
        description: 'Невалидные данные',
      },
      401: {
        description: 'Неверный email или пароль',
      },
    },
  });
}
