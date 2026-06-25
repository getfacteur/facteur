import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
} from "@tanstack/react-router";
import { MailIcon } from "lucide-react";
import { UsageBubble } from "#/components/auth/usage-bubble";
import { buttonVariants } from "#/components/ui/button";
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
		<div className="flex min-h-screen w-full flex-col">
			<header className="border-b bg-background">
				<div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
					<Link
						to="/app"
						className="inline-flex min-w-0 items-center gap-2 text-sm font-semibold"
						aria-label="Facteur app"
					>
						<span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
							<MailIcon aria-hidden="true" />
						</span>
						<span className="truncate">Facteur</span>
					</Link>
					<nav className="flex items-center gap-1">
						<Link
							to="/domains"
							className={buttonVariants({ variant: "ghost", size: "sm" })}
						>
							Domains
						</Link>
						<Link
							to="/profile"
							className={buttonVariants({ variant: "ghost", size: "sm" })}
						>
							Profile
						</Link>
						<UsageBubble />
					</nav>
				</div>
			</header>
			<main className="flex flex-1 flex-col">
				<Outlet />
			</main>
			<footer></footer>
		</div>
	);
}
