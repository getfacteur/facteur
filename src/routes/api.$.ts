import { createFileRoute } from "@tanstack/react-router"
import { Elysia, t } from "elysia"

import { OrganizationController } from "#/api/modules/organization/controller"
import { ProfileController } from "#/api/modules/profile/controller"
import { auth } from "#/lib/auth"

const app = new Elysia({
  prefix: "/api",
})
  .mount(auth.handler)
  .get("/", "Hello Elysia")
  .post(
    "/update-active-org",
    async ({ body, request, set }) => {
      const session = await auth.api.getSession({ headers: request.headers })
      if (!session) {
        set.status = 401
        return { error: "unauthorized" }
      }

      const { exists, isMember } = await OrganizationController.isUserMember(
        session.user.id,
        body.organizationId,
      )

      if (!exists || !isMember) {
        set.status = 403
        return { error: "forbidden" }
      }

      await ProfileController.updateActiveOrg(session.user.id, body.organizationId)
    },
    {
      body: t.Object({
        organizationId: t.String(),
      }),
    },
  )

const handle = ({ request }: { request: Request }) => app.fetch(request)

export const Route = createFileRoute("/api/$")({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
    },
  },
})

export type App = typeof app
