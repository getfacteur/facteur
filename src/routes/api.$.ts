import { createFileRoute } from "@tanstack/react-router"
import { Elysia, status, t } from "elysia"

import { OrganizationController } from "#/api/modules/organization/controller"
import { ProfileController } from "#/api/modules/profile/controller"
import { ProjectController, ProjectControllerError } from "#/api/modules/project/controller"
import { projectUpdateSchema } from "#/api/modules/project/schemas"
import { auth } from "#/lib/auth"

const betterAuth = new Elysia({ name: "better-auth" }).mount(auth.handler).macro({
  auth: {
    async resolve({ status, request: { headers } }) {
      const session = await auth.api.getSession({
        headers,
      })

      if (!session) return status(401)

      return {
        user: session.user,
        session: session.session,
      }
    },
  },
  activeOrg: {
    async resolve({ status, request: { headers } }) {
      const session = await auth.api.getSession({
        headers,
      })
      if (!session || !session.session.activeOrganizationId) return status(401)
      return {
        activeOrg: session.session.activeOrganizationId,
      }
    },
  },
})

const app = new Elysia({
  prefix: "/api",
})
  .use(betterAuth)
  .group("/project", { auth: true, activeOrg: true }, (app) =>
    app
      .error("PROJECT_CONTROLLER", ProjectControllerError)
      .onError(({ code, error }) => {
        if (code !== "PROJECT_CONTROLLER") {
          return
        }

        if (error.code === "forbidden") {
          return status(403, { error: "forbidden" })
        }

        return status(404, { error: "not_found", message: error.message })
      })
      .post(
        "/available",
        async ({ user, activeOrg, body }) =>
          await ProjectController.isAvailable(user.id, body.name, activeOrg),
        {
          body: t.Object({ name: t.String() }),
        },
      )
      .post(
        "/",
        async ({ user, activeOrg, body }) =>
          await ProjectController.create(user.id, {
            ...body,
            organizationId: activeOrg,
          }),
        {
          auth: true,
          body: t.Object({
            name: t.String(),
          }),
        },
      )
      .get(
        "/:id",
        async ({ user, activeOrg, params }) =>
          await ProjectController.get(user.id, activeOrg, params.id),
      )
      .put(
        "/:id",
        async ({ user, activeOrg, params, body }) =>
          await ProjectController.update(user.id, activeOrg, params.id, body),
        {
          body: projectUpdateSchema,
        },
      )
      .delete(
        "/:id",
        async ({ user, activeOrg, params }) =>
          await ProjectController.delete(user.id, activeOrg, params.id),
      )
      .get("/", async ({ user, activeOrg }) => await ProjectController.getAll(user.id, activeOrg)),
  )
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
      DELETE: handle,
      GET: handle,
      POST: handle,
      PUT: handle,
    },
  },
})

export type App = typeof app
