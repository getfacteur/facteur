import { useMutation, useQueryClient } from "@tanstack/react-query"

import { getTreaty } from "#/lib/api-client"
import { authClient } from "#/lib/auth-client"

export const useDeleteProject = () => {
  const queryClient = useQueryClient()
  const { data } = authClient.useActiveOrganization()
  const { mutate, isPending, mutateAsync } = useMutation({
    mutationFn: async (projectId: string) => {
      const response = await getTreaty().project({ id: projectId }).delete()
      if (response.error) {
        throw new Error(response.error.value.message)
      }
      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["projects", data?.id] })
    },
  })

  return { mutate, isPending, mutateAsync }
}
