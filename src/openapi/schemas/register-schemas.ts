import { registry } from '../registry';

import { accessTokenResponseSchema } from './auth/access-token-response.openapi';
import { loginOpenApiSchema } from './auth/login.schema';
import { logoutResponseOpenApiSchema } from './auth/logout-response.openapi';
import { refreshTokenOpenApiSchema } from './auth/refresh-token.openapi';
import { registerOpenApiSchema } from './auth/register.openapi';
import { createPostOpenApiSchema } from './posts/create-post.openapi';
import { getUserPostsQueryOpenApiSchema } from './posts/get-user-posts.query.openapi';
import { postIdParamOpenApiSchema } from './posts/post-id.param.openapi';
import { postResponseOpenApiSchema } from './posts/post-response.openapi';
import { postsResponseOpenApiSchema } from './posts/posts-response.openapi';
import { updatePostOpenApiSchema } from './posts/update-post.openapi';
import { createUserOpenApiSchema } from './profile/create-user.openapi';
import { updateUserOpenApiSchema } from './profile/update-user.openapi';
import { userResponseOpenApiSchema } from './profile/user-response.openapi';

export function registerSchemas() {
  registry.register('LoginDto', loginOpenApiSchema);
  registry.register('LogoutResponseDto', logoutResponseOpenApiSchema);
  registry.register('AccessTokenResponseDto', accessTokenResponseSchema);
  registry.register('RegisterDto', registerOpenApiSchema);
  registry.register('RefreshTokenDto', refreshTokenOpenApiSchema);

  registry.register('CreateUserDto', createUserOpenApiSchema);
  registry.register('UpdateUserDto', updateUserOpenApiSchema);
  registry.register('UserResponseDto', userResponseOpenApiSchema);

  registry.register('CreatePostDto', createPostOpenApiSchema);
  registry.register('UpdatePostDto', updatePostOpenApiSchema);
  registry.register('PostResponseDto', postResponseOpenApiSchema);
  registry.register('PostsResponseDto', postsResponseOpenApiSchema);
  registry.register('PostIdParamDto', postIdParamOpenApiSchema);
  registry.register('GetUserPostsQueryDto', getUserPostsQueryOpenApiSchema);
}
