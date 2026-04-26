import { createFileRoute, Link } from "@tanstack/react-router"
import { type } from "arktype"
import { toast } from "sonner"

import { Button } from "#/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card"
import { Separator } from "#/components/ui/separator"
import { useAppForm } from "#/hooks/use-app-form"
import { authClient } from "#/lib/auth-client"
import type { SocialProviders } from "#/lib/providers"

export const Route = createFileRoute("/_guest/login")({
  component: RouteComponent,
})

const loginSchema = type({
  email: "string.email",
  password: "string >= 8",
})

function RouteComponent() {
  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: loginSchema,
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.signIn.email({ ...value, callbackURL: "/onboarding" })

      if (error) {
        console.error(error)
        toast.error("Could not sign in", {
          description: error.message,
        })
        return
      }
    },
  })

  const handleSocialSignIn = async (provider: SocialProviders) => {
    const { error } = await authClient.signIn.social({ provider, callbackURL: "/onboarding" })

    if (error) {
      console.error(error)
      toast.error(`Could not sign in using ${provider}`, {
        description: error.message,
      })
      return
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <Card className="w-full max-w-sm sm:max-w-md">
        <CardHeader>
          <CardTitle>Sign in to Facteur</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            <form.AppField
              name="email"
              children={(field) => (
                <field.TextInput label="Email" autocomplete="email" type="email" />
              )}
            />
            <div className="flex flex-col">
              <div className="flex justify-end">
                <Link to="/password-forgot">Forgot your password?</Link>
              </div>
              <form.AppField
                name="password"
                children={(field) => (
                  <field.TextInput
                    label="Password"
                    autocomplete="current-password"
                    type="password"
                  />
                )}
              />
            </div>
            <div className="flex justify-end">
              <Link to="/register">Don't have an account?</Link>
            </div>
            <Button type="submit">Submit</Button>
          </form>
          <Separator />
          <div className="flex flex-col gap-2">
            <Button variant="outline" onClick={() => handleSocialSignIn("google")}>
              Sign in with Google
            </Button>
            <Button variant="outline" onClick={() => handleSocialSignIn("github")}>
              Sign in with Github
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
