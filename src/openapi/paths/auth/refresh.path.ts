import { registry } from '../../registry';

export function registerAuthRefreshPath() {
  registry.registerPath({
    method: 'post',
    path: '/auth/refresh',
    summary: 'Обновить access и refresh токен',
    description: 'Нужно передать `refreshToken` в cookie',
    tags: ['Auth'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/RefreshTokenDto' },
          },
        },
      },
    },
    responses: {
      200: {
        description:
          'Обновлённый access токен. Новый refresh токен записан в cookie.',
        headers: {
          'Set-Cookie': {
            description: 'Устанавливает новый refresh токен (httpOnly, secure)',
            schema: {
              type: 'string',
              example:
                'refreshToken=abc123; HttpOnly; Secure; SameSite=Strict; Expires=Sat, 04 May 2025 10:00:00 GMT; Path=/',
            },
          },
        },
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/AccessTokenResponseDto' },
          },
        },
      },
    },
  });
}
