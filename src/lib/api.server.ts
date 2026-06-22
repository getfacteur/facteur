import { cors } from "@elysia/cors";
import { openapi } from "@elysia/openapi";
import { Elysia, t } from "elysia";
import { auth } from "./auth";
import { env } from "./env.server";
import {
	createDomain,
	DomainAccessError,
	deleteDomain,
	getDomains,
	verifyDomain,
} from "./services/domains";

const appOrigin = new URL(env.BETTER_AUTH_URL).origin;

export const app = new Elysia({
	name: "facteur",
	prefix: "/api",
})
	.use(
		openapi({
			documentation: {
				info: {
					title: "Facteur",
					version: "1.0.0",
				},
				tags: [{ name: "Domains" }],
			},
		}),
	)
	.use(
		cors({
			credentials: true,
			origin: appOrigin,
		}),
	)
	.mount(auth.handler)
	.macro({
		auth: {
			async resolve({ status, request: { headers } }) {
				const session = await auth.api.getSession({
					headers,
				});
				if (!session) return status(401);
				return {
					user: session.user,
					session: session.session,
				};
			},
		},
	})
	.group("/domains", { auth: true, detail: { tags: ["Domains"] } }, (router) =>
		router
			.get("/", async ({ user }) => {
				return getDomains(user.id);
			})
			.post(
				"/",
				async ({ user, body }) => {
					const result = await createDomain(user.id, body.domain);
					return result;
				},
				{
					body: t.Object({
						domain: t.String(),
					}),
				},
			)
			.post("/:id/verify", async ({ params, status, user }) => {
				try {
					await verifyDomain(user.id, params.id);
					return status(202, { status: "verification_queued" });
				} catch (error) {
					if (error instanceof DomainAccessError) {
						return status(403, { status: "forbidden" });
					}
					throw error;
				}
			})
			.delete("/:id", async ({ user, params, status }) => {
				try {
					await deleteDomain(user.id, params.id);
					return new Response(null, { status: 204 });
				} catch (error) {
					if (error instanceof DomainAccessError) {
						return status(403, { status: "forbidden" });
					}
					throw error;
				}
			}),
	);

export const handle = ({ request }: { request: Request }) => app.fetch(request);

export const apiHandlers = {
	GET: handle,
	POST: handle,
	DELETE: handle,
	PUT: handle,
	PATCH: handle,
	OPTIONS: handle,
};
