import { registry } from '../../registry';

export function registerGetUserPostsPath() {
  registry.registerPath({
    method: 'get',
    path: '/posts/get-user-posts',
    summary: 'Получить посты текущего пользователя',
    tags: ['Posts'],
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        name: 'limit',
        in: 'query',
        required: false,
        schema: { type: 'string', example: '10' },
      },
      {
        name: 'offset',
        in: 'query',
        required: false,
        schema: { type: 'string', example: '0' },
      },
      {
        name: 'sort',
        in: 'query',
        required: false,
        schema: {
          type: 'string',
          enum: ['ASC', 'DESC'],
          example: 'DESC',
        },
      },
    ],
    responses: {
      200: {
        description: 'Список постов пользователя',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/PostsResponseDto' },
          },
        },
      },
    },
  });
}
