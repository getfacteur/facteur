import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

import { Header } from "#/components/elements/auth/header"
import { getSession } from "#/lib/session"

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
  beforeLoad: async ({ matches }) => {
    const session = await getSession()
    if (!session?.data?.user) {
      throw redirect({ to: "/login" })
    }
    if (
      !matches.find((match) => match.routeId === "/_auth/onboarding") &&
      !session?.data?.session.activeOrganizationId
    ) {
      throw redirect({ to: "/onboarding" })
    }
    return {
      user: session.data.user,
    }
  },
})

function RouteComponent() {
  return (
    <main className="flex flex-1 flex-col">
      <Header />
      <div className="flex flex-1 flex-col">
        <Outlet />
      </div>
    </main>
  )
}
