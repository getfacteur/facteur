import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"

import { getTreaty } from "#/lib/api-client"
import { authClient } from "#/lib/auth-client"

export const useProjects = () => {
  const { data } = authClient.useActiveOrganization()
  const { data: projectData, isPending } = useQuery({
    queryKey: ["projects", data?.id],
    queryFn: async () => {
      const result = await getTreaty().project.get()
      if (result.error) {
        throw Error(result.error.value)
      }
      return result.data
    },
    enabled: !!data?.id,
  })

  return useMemo(() => {
    return {
      data: projectData,
      isPending,
    }
  }, [projectData, isPending])
}
