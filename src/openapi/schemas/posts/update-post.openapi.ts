import { z } from "zod"
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi"

import { updatePostSchema as baseSchema } from "../../../modules/posts/dto/update-post.schema"

extendZodWithOpenApi(z)

export const updatePostOpenApiSchema = baseSchema
  .extend({
    text: baseSchema.shape.text?.openapi({
      description: "Обновлённый текст поста",
      example: "Теперь я обновил этот пост!",
    }),
    deleteImageIds: z
      .array(z.coerce.number())
      .optional()
      .openapi({
        description: "Массив ID изображений, которые нужно удалить",
        example: [1, 2, 3],
      }),
  })
  .openapi("UpdatePostDto")
