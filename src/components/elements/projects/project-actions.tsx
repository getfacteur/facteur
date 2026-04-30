import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import type { FC } from "react"
import { useState } from "react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "#/components/ui/alert-dialog"
import { Button } from "#/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu"
import { useDeleteProject } from "#/queries/use-delete-project"

import { ProjectDialog } from "./project-dialog"

interface Props {
  project: {
    id: string
    name: string
  }
}

export const ProjectActions: FC<Props> = ({ project }) => {
  const [updateOpen, setUpdateOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { mutateAsync: deleteProject, isPending: isDeleting } = useDeleteProject()

  const handleDelete = async () => {
    try {
      await deleteProject(project.id)
      toast.success(`Project ${project.name} deleted`)
      setDeleteOpen(false)
    } catch (e) {
      toast.error("Project could not be deleted")
      console.error(e)
    }
  }

  return (
    <>
      <ProjectDialog
        key={project.id}
        open={updateOpen}
        setOpen={setUpdateOpen}
        projectId={project.id}
        initialData={{ name: project.name }}
      />
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon-sm" aria-label={`Open actions for ${project.name}`}>
              <MoreHorizontal />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setUpdateOpen(true)}>
              <Pencil />
              Update project
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
              <Trash2 />
              Delete project
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project {project.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The project will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={(e) => {
                e.preventDefault()
                void handleDelete()
              }}
            >
              Delete project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
