import { registry } from '../../registry';

export function registerAuthLogoutPath() {
  registry.registerPath({
    method: 'post',
    path: '/auth/logout',
    summary: 'Выход пользователя и удаление refresh токена',
    tags: ['Auth'],
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'Успешный выход',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/AccessTokenResponseDto' },
          },
        },
      },
    },
  });
}
