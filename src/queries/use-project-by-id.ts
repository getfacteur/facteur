import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"

import { getTreaty } from "#/lib/api-client"

export const useProjectById = (projectId: string) => {
  const { data, isPending } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getTreaty().project({ id: projectId }).get(),
    enabled: !!projectId,
  })

  return useMemo(
    () => ({
      data: data?.data,
      isPending,
    }),
    [data, isPending],
  )
}
