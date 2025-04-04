import { registry } from '../../registry';

export function registerUpdatePostPath() {
  registry.registerPath({
    method: 'patch',
    path: '/posts/{id}',
    summary: 'Обновить пост',
    tags: ['Posts'],
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string', example: '1' },
      },
    ],
    request: {
      body: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                text: { type: 'string', example: 'Обновлённый текст' },
                deleteImageIds: {
                  type: 'string',
                  example: '[1,2]',
                  description:
                    'Массив id изображений, которые нужно удалить. Пример: [23, 56, 79]',
                },
                file: {
                  type: 'array',
                  items: { type: 'string', format: 'binary' },
                  description:
                    'До 10 файлов PNG или JPEG, каждый не более 5MB. Все файлы передаются в отдельных полях с именем "file".',
                },
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Обновлённый пост',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/PostResponseDto' },
          },
        },
      },
    },
  });
}
