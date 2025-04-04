import { registry } from '../../registry';

export function registerDeletePostPath() {
  registry.registerPath({
    method: 'delete',
    path: '/posts/{id}',
    summary: 'Удалить пост',
    tags: ['Posts'],
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        schema: {
          type: 'string',
          example: '1',
        },
      },
    ],
    responses: {
      204: {
        description: 'Пост успешно удалён. Тело ответа отсутствует.',
      },
    },
  });
}
