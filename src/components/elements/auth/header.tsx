import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"

import { Button } from "#/components/ui/button"
import { authClient } from "#/lib/auth-client"

import { OrgPicker } from "./org-picker"

export const Header = () => {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    const { error } = await authClient.signOut()

    if (error) {
      console.error(error)
      toast.error("Could not sign out", {
        description: error.message,
      })
      return
    }

    navigate({ to: "/login" })
  }

  return (
    <header>
      <div className="flex gap-4">
        <OrgPicker />
        <Button onClick={handleSignOut}>Sign Out</Button>
      </div>
    </header>
  )
}
