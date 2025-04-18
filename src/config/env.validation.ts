import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']),
  SERVER_HOST: z.string(),
  SERVER_PORT: z.coerce.number(),
  OPENAPI_URL: z.string(),
  CLIENT_URL: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.coerce.number(),
  POSTGRES_USERNAME: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
});

export function validate(env: Record<string, unknown>) {
  const validatedEnv = envSchema.parse(env);
  return validatedEnv;
}