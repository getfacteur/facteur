import { getSession } from "@/lib/auth-client";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await getSession();
    if (!session?.data?.user) {
      throw redirect({ to: "/login" });
    }

    return {
      user: session.data.user,
    };
  },
});

function RouteComponent() {
  return <Outlet />;
}
