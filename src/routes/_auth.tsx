import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { UsageBubble } from "#/components/auth/usage-bubble";
import { getSession } from "#/lib/session";

export const Route = createFileRoute("/_auth")({
	component: RouteComponent,
	beforeLoad: async () => {
		const session = await getSession();
		if (!session?.data?.user) {
			throw redirect({ to: "/sign-in" });
		}

		return {
			user: session.data.user,
		};
	},
});

function RouteComponent() {
	return (
		<div className="w-full min-h-screen flex flex-col">
			<header>
				<UsageBubble />
			</header>
			<main className="flex flex-col flex-1">
				<Outlet />
			</main>
			<footer></footer>
		</div>
	);
}
