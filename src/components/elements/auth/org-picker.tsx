import { Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "#/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "#/components/ui/combobox"
import { authClient } from "#/lib/auth-client"
import { useUpdateActiveOrg } from "#/queries/use-update-active-org"

import { OrgDialog } from "./org-dialog"

export const OrgPicker = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { data: organizations } = authClient.useListOrganizations()
  const { data: activeOrganization } = authClient.useActiveOrganization()
  const { mutateAsync: updateActiveOrg } = useUpdateActiveOrg()
  return (
    <div className="flex gap-4">
      <OrgDialog open={dialogOpen} setOpen={setDialogOpen} />
      <Combobox
        items={organizations ?? []}
        value={activeOrganization ?? null}
        isItemEqualToValue={(item, value) => item.id === value.id}
        itemToStringLabel={(item) => item.name}
        itemToStringValue={(item) => item.id}
        onValueChange={async (organization) => {
          if (!organization) {
            return
          }
          const previousOrgId = activeOrganization?.id ?? null
          try {
            const { error: setActiveError } = await authClient.organization.setActive({
              organizationId: organization.id,
            })
            if (setActiveError) {
              toast.error(setActiveError.message)
              return
            }
            await updateActiveOrg(organization.id)
          } catch (err) {
            if (previousOrgId) {
              await authClient.organization.setActive({
                organizationId: previousOrgId,
              })
            }
            const message =
              err instanceof Error ? err.message : "Failed to update active organization"
            toast.error(message)
          }
        }}
      >
        <ComboboxInput placeholder="select an organisation" />
        <ComboboxContent>
          <ComboboxEmpty>No Organisation found</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.id} value={item}>
                {item.name}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <Button size="icon" onClick={() => setDialogOpen(true)}>
        <Plus />
      </Button>
    </div>
  )
}
