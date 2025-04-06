import type { PostResponseDto } from "../dto/post-response.schema"
import { Post } from '../entities/post.entity'

export function omitUser(
  data: Post | Post[] 
): PostResponseDto | PostResponseDto[] {
  if (Array.isArray(data)) {
    return data.map(({ user, ...rest }) => rest)
  }

  const { user, ...rest } = data
  return rest
}