import { registry } from '../../registry';

export function registerCreatePostPath() {
  registry.registerPath({
    method: 'post',
    path: '/posts/create-post',
    summary: 'Создать новый пост',
    tags: ['Posts'],
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                text: {
                  type: 'string',
                  description: 'Текст поста',
                  example: 'Мой пост!',
                },
                file: {
                  type: 'array',
                  items: {
                    type: 'string',
                    format: 'binary',
                  },
                  description: `До 10 файлов PNG или JPEG, каждый не более 5MB. Все файлы передаются в отдельных полях с именем "file".`,
                },
              },
              required: ['text'],
            },
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Созданный пост',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/PostResponseDto',
            },
          },
        },
      },
    },
  });
}
