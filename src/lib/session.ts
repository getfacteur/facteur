import { createIsomorphicFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"

import { auth } from "./auth"
import { authClient } from "./auth-client"

export const getSession = createIsomorphicFn()
  .server(async () => {
    try {
      const result = await auth.api.getSession({ headers: getRequestHeaders() })

      return { data: result }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error("Failed to get session"),
      }
    }
  })
  .client(() => authClient.getSession())
