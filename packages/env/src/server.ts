import z from "zod";
const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  ALLOWED_ORIGINS: z.string(),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),
  DATABASE_URL: z.string(),
});

export const env = envSchema.parse(process.env);
