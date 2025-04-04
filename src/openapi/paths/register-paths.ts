import { registerAuthLoginPath } from './auth/login.path';
import { registerAuthLogoutPath } from './auth/logout.path';
import { registerAuthRefreshPath } from './auth/refresh.path';
import { registerAuthRegisterPath } from './auth/register.path';
import { registerCreatePostPath } from './posts/create-post.path';
import { registerDeletePostPath } from './posts/delete-post.path';
import { registerGetUserPostsPath } from './posts/get-user-posts.path';
import { registerUpdatePostPath } from './posts/update-post.path';
import { registerGetProfilePath } from './profile/get-profile.path';
import { registerUpdateProfilePath } from './profile/update-profile.path';
import { registerUploadAvatarPath } from './profile/upload-avatar.path';

export function registerPaths() {
  registerAuthRegisterPath();
  registerAuthLoginPath();
  registerAuthLogoutPath();
  registerAuthRefreshPath();

  registerGetProfilePath();
  registerUpdateProfilePath();
  registerUploadAvatarPath();

  registerCreatePostPath();
  registerDeletePostPath();
  registerUpdatePostPath();
  registerGetUserPostsPath();
}
