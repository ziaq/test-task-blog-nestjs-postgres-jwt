import type { PostResponseDto } from '../dto/post-response.schema';
import { Post } from '../entities/post.entity';

export function omitUser(
  data: Post | Post[],
): PostResponseDto | PostResponseDto[] {
  if (Array.isArray(data)) {
    return data.map(({ user: _, ...rest }) => rest);
  }

  const { user: _, ...rest } = data;
  return rest;
}
