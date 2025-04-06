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
          $ref: '#/components/schemas/PostIdParamDto/properties/id',
        },
      },
    ],
    responses: {
      204: {
        description: 'Пост успешно удалён. Тело ответа отсутствует.',
      },
      400: {
        description: 'Невалидные данные',
      },
      401: {
        description:
          'Пользователь не авторизован (access token не передан или недействителен)',
      },
      403: {
        description: 'Доступ запрещён: пользователь не является владельцем поста',
      },
      404: {
        description: 'Пост не найден',
      },
    },
  });
}
