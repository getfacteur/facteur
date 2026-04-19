import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

import { getSession } from "#/lib/session"

export const Route = createFileRoute("/_guest")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await getSession()
    if (session?.data?.user) {
      throw redirect({ to: "/" })
    }
  },
})

function RouteComponent() {
  return (
    <main className="flex flex-1 flex-col">
      <Outlet />
    </main>
  )
}
