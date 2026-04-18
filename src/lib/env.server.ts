import { type } from "arktype"
const envSchema = type({
  DATABASE_URL: "string",
  BETTER_AUTH_SECRET: "string",
  BETTER_AUTH_URL: "string",
})

export const env = envSchema.assert(process.env)
