import cors from "@elysia/cors";
import { env } from "@facteur/env/server";
import Elysia from "elysia";
import { openapi } from "@elysia/openapi";
import { betterAuth } from "./modules/auth/router";
import {
  providerCreateSchema,
  providerUpdateSchema,
} from "./modules/provider/schemas";
import { ProviderService } from "./modules/provider/service";

const app = new Elysia()
  .use(cors({ origin: env.ALLOWED_ORIGINS, credentials: true }))
  .use(openapi())
  .use(betterAuth)
  .group("/provider", { auth: true }, (providerGroup) =>
    providerGroup
      .get("/", ({ user }) => ProviderService.getAll(user.id))
      .post("/", ({ user, body }) => ProviderService.store(user.id, body), {
        body: providerCreateSchema,
      })
      .get("/:id", ({ params }) => ProviderService.get(params.id))
      .patch(
        "/:id",
        ({ params, body }) => ProviderService.update(params.id, body),
        { body: providerUpdateSchema },
      )
      .delete("/:id", ({ params }) => ProviderService.delete(params.id)),
  )
  .get("/", () => "Hello World");

export { app };
