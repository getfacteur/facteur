import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSession } from "#/lib/session";

export const Route = createFileRoute("/_guest")({
	component: RouteComponent,
	beforeLoad: async () => {
		const session = await getSession();
		if (session?.data?.user) {
			throw redirect({ to: "/app" });
		}
	},
});

function RouteComponent() {
	return <Outlet />;
}
