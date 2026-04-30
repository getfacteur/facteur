import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"

import { ProjectDialog } from "#/components/elements/projects/project-dialog"
import { ProjectTable } from "#/components/elements/projects/projects-table"
import { Button } from "#/components/ui/button"

export const Route = createFileRoute("/_auth/")({
  component: RouteComponent,
})

function RouteComponent() {
  const [projectOpen, setProjectOpen] = useState(false)
  return (
    <div>
      <ProjectDialog open={projectOpen} setOpen={setProjectOpen} />

      <Button onClick={() => setProjectOpen(true)}>Create project</Button>
      <ProjectTable />
    </div>
  )
}
