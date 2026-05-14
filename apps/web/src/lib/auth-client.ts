import { env } from "@facteur/env/client";
import { apiKeyClient } from "@better-auth/api-key/client";
import { createAuthClient } from "better-auth/react";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
export const authClient = createAuthClient({
  baseURL: env.VITE_SERVER_URL,
  plugins: [apiKeyClient()],
});

export const getSession = createIsomorphicFn()
  .server(() =>
    authClient.getSession({
      fetchOptions: {
        headers: getRequestHeaders(),
      },
    }),
  )
  .client(() => authClient.getSession());
