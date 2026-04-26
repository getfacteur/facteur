import { useStore } from "@tanstack/react-form"
import { useDebouncedValue } from "@tanstack/react-pacer"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Navigate } from "@tanstack/react-router"
import { Check, X } from "lucide-react"
import slugify from "slugify"
import { toast } from "sonner"

import { Button } from "#/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card"
import { Input } from "#/components/ui/input"
import { Spinner } from "#/components/ui/spinner"
import { useAppForm } from "#/hooks/use-app-form"
import { authClient } from "#/lib/auth-client"

export const Route = createFileRoute("/_auth/onboarding")({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isPending } = authClient.useActiveOrganization()

  const form = useAppForm({
    defaultValues: {
      name: "",
    },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.organization.create({
        ...value,
        slug: slugify(value.name),
      })
      if (error) {
        toast.error(error.message)
        return
      }
      toast.success("Organization created")
      Route.redirect({ to: "/" })
    },
  })

  const name = useStore(form.store, (state) => state.values.name)

  const [slug] = useDebouncedValue(slugify(name), {
    wait: 200,
  })

  const { data: validSlug, isLoading } = useQuery({
    queryKey: ["org", slug],
    queryFn: async () => {
      const { data } = await authClient.organization.checkSlug({
        slug,
      })
      return data?.status ?? false
    },
    enabled: slug.length > 0,
  })

  if (!isPending && data?.id) {
    return <Navigate to="/" />
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <Card className="w-full max-w-sm sm:max-w-md">
        <CardHeader>
          <CardTitle>Let's get you set up</CardTitle>
          <CardDescription>
            You need to create (or be a part of) an organization to use Facteur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            <form.AppField name="name" children={(field) => <field.TextInput label="name" />} />
            <div>
              <Input disabled value={slug} />
              <span>
                {slug.length === 0 ? null : isLoading ? (
                  <Spinner className="size-4" />
                ) : validSlug ? (
                  <Check className="size-4" />
                ) : (
                  <X className="size-4" />
                )}
                {slug.length === 0
                  ? "Enter an organization name"
                  : isLoading
                    ? "Loading..."
                    : validSlug
                      ? "Organization is available"
                      : "Organization is already taken"}
              </span>
            </div>
            <form.Subscribe
              selector={(state) => state.isValid}
              children={(isValid) => (
                <Button type="submit" disabled={!isValid || !validSlug}>
                  Create Organization
                </Button>
              )}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
