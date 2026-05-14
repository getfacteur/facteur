import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppForm } from "@/hooks/use-app-form";
import { authClient } from "@/lib/auth-client";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import z from "zod";

export const Route = createFileRoute("/_guest/register")({
  component: RouteComponent,
});

const registerSchema = z.object({
  name: z.string().nonempty(),
  email: z.email(),
  password: z.string().min(8),
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const form = useAppForm({
    validators: {
      onChange: registerSchema,
      onBlur: registerSchema,
      onSubmit: registerSchema,
    },
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.signUp.email(value);
      if (error) {
        toast.error(error.message);
        return;
      }
      navigate({ to: "/dashboard" });
    },
  });
  return (
    <div className="flex h-svh">
      <div className="flex flex-col w-full md:justify-center md:items-center md:px-4">
        <Card className="w-full md:max-w-lg">
          <CardHeader>
            <CardTitle className="text-center">Welcome to Facteur</CardTitle>
            <CardDescription className="text-center">
              Register below and start sending mails
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="gap-6 flex flex-col"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <div className="flex flex-col gap-2">
                <form.AppField
                  name="name"
                  children={(field) => (
                    <field.TextField
                      label="Name"
                      autocomplete="name webauthn"
                    />
                  )}
                />
                <form.AppField
                  name="email"
                  children={(field) => (
                    <field.TextField
                      label="Email"
                      type="email"
                      autocomplete="email webauthn"
                    />
                  )}
                />
                <form.AppField
                  name="password"
                  children={(field) => (
                    <field.TextField
                      label="Password"
                      type="password"
                      autocomplete="new-password webauthn"
                    />
                  )}
                />
              </div>
              <form.Subscribe
                selector={(state) => ({
                  isValid: state.isValid,
                  isSubmitting: state.isSubmitting,
                })}
                children={({ isValid, isSubmitting }) => (
                  <Button type="submit" disabled={!isValid || isSubmitting}>
                    {isSubmitting && <Loader2Icon />}
                    Submit
                  </Button>
                )}
              />
            </form>
          </CardContent>
        </Card>
      </div>
      <div className="w-full h-full hidden md:block">
        <img src="/auth.webp" className="object-cover h-full w-full" />
      </div>
    </div>
  );
}
