import { registry } from '../../registry';

export function registerUploadAvatarPath() {
  registry.registerPath({
    method: 'post',
    path: '/profile/upload-avatar',
    summary: 'Загрузить новый аватар пользователя',
    tags: ['Profile'],
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                file: {
                  type: 'string',
                  format: 'binary',
                  description: 'PNG или JPEG изображение. Макс. размер — 5MB',
                },
              },
              required: ['file'],
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Профиль с обновлённым аватаром',
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
