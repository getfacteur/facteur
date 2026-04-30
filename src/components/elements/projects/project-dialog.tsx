import { useStore } from "@tanstack/react-form"
import { useDebouncedValue } from "@tanstack/react-pacer"
import { Check, X } from "lucide-react"
import type { FC } from "react"
import { toast } from "sonner"

import { projectUpdateSchema, type ProjectUpdateSchema } from "#/api/modules/project/schemas"
import { useAppForm } from "#/hooks/use-app-form"
import { useCreateProject } from "#/queries/use-create-project"
import { useIsProjectAvailable } from "#/queries/use-is-project-available"
import { useUpdateProject } from "#/queries/use-update-project"

import { Button } from "../../ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog"
import { Spinner } from "../../ui/spinner"

interface Props {
  open: boolean
  setOpen: (v: boolean) => void
  projectId?: string
  initialData?: Partial<ProjectUpdateSchema>
}

export const ProjectDialog: FC<Props> = ({ open, setOpen, projectId = "", initialData }) => {
  const { mutateAsync: createProject } = useCreateProject()
  const { mutateAsync: updateProject } = useUpdateProject(projectId)
  const isEditing = !!projectId
  const initialName = initialData?.name ?? ""

  const form = useAppForm({
    defaultValues: {
      name: initialName,
    },
    validators: {
      onChange: projectUpdateSchema,
      onSubmit: projectUpdateSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        if (isEditing) {
          await updateProject(value)
          toast.success(`Project ${value.name} updated`)
        } else {
          await createProject(value)
          toast.success(`Project ${value.name} created`)
        }
        setOpen(false)
      } catch (e) {
        toast.error(`Project could not be ${isEditing ? "updated" : "created"}`)
        console.error(e)
      }
    },
  })

  const formName = useStore(form.store, (state) => state.values.name)

  const [debouncedName] = useDebouncedValue(formName, {
    wait: 200,
  })

  const { data: isProjectNameAvailable, isLoading } = useIsProjectAvailable(debouncedName)
  const isUnchangedName = isEditing && formName === initialName
  const canUseProjectName = isUnchangedName || isProjectNameAvailable === true

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? `Update project ${initialName}` : "Create Project"}
          </DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <form.AppField
            name="name"
            children={(field) => <field.TextInput label="Project Name" />}
          />
          <div className="flex items-center gap-4">
            {isUnchangedName || isProjectNameAvailable == undefined ? null : isLoading ? (
              <Spinner className="size-4" />
            ) : isProjectNameAvailable ? (
              <Check className="size-4" />
            ) : (
              <X className="size-4" />
            )}
            {formName.length === 0
              ? "Enter a project name"
              : isUnchangedName
                ? "Project name is unchanged"
                : isLoading
                  ? "Loading..."
                  : isProjectNameAvailable
                    ? "Project name is available"
                    : "Project name is already taken"}
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="secondary">Cancel</Button>} />
            <form.Subscribe
              selector={(state) => state.isValid}
              children={(isValid) => (
                <Button type="submit" disabled={!isValid || !canUseProjectName}>
                  {isEditing ? "Update Project" : "Create Project"}
                </Button>
              )}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
