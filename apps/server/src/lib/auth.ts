import { db } from "@/db";
import { apiKey } from "@better-auth/api-key";
import { env } from "@facteur/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
export const auth = betterAuth({
  trustedOrigins: env.ALLOWED_ORIGINS.split(","),
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  plugins: [apiKey()],
  emailAndPassword: {
    enabled: true,
  },
});
