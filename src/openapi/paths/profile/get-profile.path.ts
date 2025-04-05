import { registry } from '../../registry';

export function registerGetProfilePath() {
  registry.registerPath({
    method: 'get',
    path: '/profile',
    summary: 'Получить профиль текущего пользователя',
    tags: ['Profile'],
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'Профиль пользователя',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UserResponseDto',
            },
          },
        },
      },
      401: {
        description:
          'Пользователь не авторизован (access token не передан или недействителен)',
      },
    },
  });
}
