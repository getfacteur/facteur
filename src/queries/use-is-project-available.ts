import { useQuery } from "@tanstack/react-query"

import { getTreaty } from "#/lib/api-client"
import { authClient } from "#/lib/auth-client"

export const useIsProjectAvailable = (name: string) => {
  const { data: organization } = authClient.useActiveOrganization()
  const { data, isLoading } = useQuery({
    queryKey: ["project-name", organization?.id, name],
    queryFn: async () => {
      const response = await getTreaty().project.available.post({ name })
      if (response.error) {
        throw new Error(response.error.value.message)
      }
      return response.data
    },
    enabled: !!name && !!organization?.id,
  })

  return {
    data: data === true,
    isLoading,
  }
}
