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
        required: true,
        schema: {
          $ref: '#/components/schemas/GetUserPostsQueryDto/properties/limit',
        },
      },
      {
        name: 'offset',
        in: 'query',
        required: true,
        schema: {
          $ref: '#/components/schemas/GetUserPostsQueryDto/properties/offset',
        },
      },
      {
        name: 'sort',
        in: 'query',
        required: true,
        schema: {
          $ref: '#/components/schemas/GetUserPostsQueryDto/properties/sort',
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
      401: {
        description:
          'Пользователь не авторизован (access token не передан или недействителен)',
      },
    },
  });
}
