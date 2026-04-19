import { type } from "arktype"
const envSchema = type({
  DATABASE_URL: "string",
  BETTER_AUTH_SECRET: "string",
  BETTER_AUTH_URL: "string",
  GITHUB_CLIENT_ID: "string",
  GITHUB_CLIENT_SECRET: "string",
  GOOGLE_CLIENT_ID: "string",
  GOOGLE_CLIENT_SECRET: "string",
})

export const env = envSchema.assert(process.env)
