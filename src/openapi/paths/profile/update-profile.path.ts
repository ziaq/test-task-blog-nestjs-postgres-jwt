import { registry } from '../../registry';

export function registerUpdateProfilePath() {
  registry.registerPath({
    method: 'patch',
    path: '/profile',
    summary: 'Обновить профиль текущего пользователя',
    tags: ['Profile'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateUserDto',
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'Профиль обновлён',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UserResponseDto',
            },
          },
        },
      },
    },
  });
}
