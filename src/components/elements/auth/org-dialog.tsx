import { useStore } from "@tanstack/react-form"
import { useDebouncedValue } from "@tanstack/react-pacer"
import { useQuery } from "@tanstack/react-query"
import { Check, X } from "lucide-react"
import type { FC } from "react"
import slugify from "slugify"
import { toast } from "sonner"

import { Button } from "#/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog"
import { Input } from "#/components/ui/input"
import { Spinner } from "#/components/ui/spinner"
import { useAppForm } from "#/hooks/use-app-form"
import { authClient } from "#/lib/auth-client"

interface Props {
  open: boolean
  setOpen: (v: boolean) => void
}

export const OrgDialog: FC<Props> = ({ open, setOpen }) => {
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
      setOpen(false)
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create an org</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="flex flex-col gap-4"
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
          <DialogFooter>
            <DialogClose render={<Button variant="secondary">Close</Button>} />
            <form.Subscribe
              selector={(state) => state.isValid}
              children={(isValid) => (
                <Button type="submit" disabled={!isValid || !validSlug}>
                  Create Organization
                </Button>
              )}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
