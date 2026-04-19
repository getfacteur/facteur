import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_guest/password-forgot")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_guest/password-forgot"!</div>
}
