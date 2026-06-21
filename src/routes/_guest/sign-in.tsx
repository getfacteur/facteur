import { createFileRoute, Link } from "@tanstack/react-router";
import { MailIcon } from "lucide-react";
import { SignInForm } from "#/components/auth/sign-in-form";

interface SignInSearch {
	error?: string;
}

export const Route = createFileRoute("/_guest/sign-in")({
	validateSearch: (search: Record<string, unknown>): SignInSearch => ({
		error: typeof search.error === "string" ? search.error : undefined,
	}),
	head: () => ({
		meta: [
			{
				title: "Sign in | Facteur",
			},
			{
				name: "description",
				content: "Sign in to Facteur with an email magic link or passkey.",
			},
		],
	}),
	component: SignInPage,
});

function SignInPage() {
	const search = Route.useSearch();

	return (
		<SignInLayout>
			<SignInForm callbackError={search.error} />
		</SignInLayout>
	);
}

function SignInLayout({ children }: { children: React.ReactNode }) {
	return (
		<main className="grid min-h-svh bg-background lg:grid-cols-[minmax(0,0.9fr)_minmax(34rem,1.1fr)]">
			<section className="flex min-h-svh flex-col px-6 py-6 sm:px-10 sm:py-8 lg:px-[clamp(3rem,7vw,7rem)]">
				<header>
					<Link
						to="/"
						className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight"
						aria-label="Facteur home"
					>
						<span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
							<MailIcon className="size-3.5" aria-hidden="true" />
						</span>
						Facteur
					</Link>
				</header>

				<div className="flex flex-1 items-center py-12">
					<div className="w-full max-w-sm">{children}</div>
				</div>
			</section>

			<aside className="relative hidden min-h-svh overflow-hidden bg-muted lg:block">
				<img
					src="/facteur-cover.webp"
					alt=""
					className="absolute inset-0 size-full object-cover "
				/>
			</aside>
		</main>
	);
}
