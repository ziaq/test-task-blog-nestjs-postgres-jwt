import { registry } from '../../registry';

export function registerAuthLogoutPath() {
  registry.registerPath({
    method: 'post',
    path: '/auth/logout',
    summary: 'Выход пользователя и удаление refresh токена',
    description: 'Нужно передать `refreshToken` в cookie',
    tags: ['Auth'],
    responses: {
      200: {
        description: 'Успешный выход',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/LogoutResponseDto' },
          },
        },
      },
      401: {
        description: 'Отсутствует или невалиден refresh токен',
      },
    },
  });
}
