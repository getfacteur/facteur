import { createFileRoute, Link } from "@tanstack/react-router"
import { type } from "arktype"
import { toast } from "sonner"

import { Button } from "#/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card"
import { Separator } from "#/components/ui/separator"
import { useAppForm } from "#/hooks/use-app-form"
import { authClient } from "#/lib/auth-client"
import type { SocialProviders } from "#/lib/providers"

const registerSchema = type({
  email: "string.email",
  name: "string > 0",
  password: "string >= 8",
})

export const Route = createFileRoute("/_guest/register")({
  component: RouteComponent,
})

function RouteComponent() {
  const form = useAppForm({
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
    validators: {
      onChange: registerSchema,
      onSubmit: registerSchema,
    },
    onSubmit: async ({ value }) => {
      const name = value.name.trim()

      if (!name) {
        toast.error("Could not create an account", {
          description: "Please enter a valid username.",
        })
        return
      }

      const { error } = await authClient.signUp.email({ ...value, name, callbackURL: "/" })

      if (error) {
        console.error(error)
        toast.error("Could not create an account", {
          description: error.message,
        })
        return
      }
    },
  })

  const handleSocialSignUp = async (provider: SocialProviders) => {
    const { error } = await authClient.signIn.social({ provider, callbackURL: "/" })

    if (error) {
      console.error(error)
      toast.error(`Could not sign up using ${provider}`, {
        description: error.message,
      })
      return
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <Card className="w-full max-w-sm sm:max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Facteur</CardTitle>
          <CardDescription>Fill out the form below to create your account</CardDescription>
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
            <form.AppField
              name="name"
              children={(field) => (
                <field.TextInput label="Username" autocomplete="username" type="text" />
              )}
            />
            <form.AppField
              name="password"
              children={(field) => (
                <field.TextInput label="Password" autocomplete="new-password" type="password" />
              )}
            />
            <div className="flex justify-end">
              <Link to="/login">Already have an account?</Link>
            </div>
            <Button type="submit">Submit</Button>
          </form>
          <Separator />
          <div className="flex flex-col gap-2">
            <Button variant="outline" onClick={() => handleSocialSignUp("google")}>
              Sign up with Google
            </Button>
            <Button variant="outline" onClick={() => handleSocialSignUp("github")}>
              Sign up with Github
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
