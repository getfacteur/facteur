import { treaty } from "@elysiajs/eden"
import { createFileRoute } from "@tanstack/react-router"
import { createIsomorphicFn } from "@tanstack/react-start"
import { Elysia } from "elysia"

import { auth } from "#/lib/auth"

const app = new Elysia({
  prefix: "/api",
})
  .mount(auth.handler)
  .get("/", "Hello Elysia")

const handle = ({ request }: { request: Request }) => app.fetch(request)

export const Route = createFileRoute("/api/$")({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
    },
  },
})

type App = typeof app

export const getTreaty = createIsomorphicFn()
  .server(() => treaty(app).api)
  .client(() => treaty<App>("localhost:3000").api)
