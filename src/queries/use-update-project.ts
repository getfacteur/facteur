import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { ProjectUpdateSchema } from "#/api/modules/project/schemas"
import { getTreaty } from "#/lib/api-client"
import { authClient } from "#/lib/auth-client"

export const useUpdateProject = (projectId: string) => {
  const queryClient = useQueryClient()
  const { data } = authClient.useActiveOrganization()
  const { mutate, isPending, mutateAsync } = useMutation({
    mutationFn: async (body: ProjectUpdateSchema) => {
      const response = await getTreaty().project({ id: projectId }).put(body)
      if (response.error) {
        throw new Error(response.error.value.message)
      }
      return response.data
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["projects", data?.id] }),
        queryClient.invalidateQueries({ queryKey: ["project", projectId] }),
      ])
    },
  })

  return { mutate, isPending, mutateAsync }
}
