import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { ProjectCreateSchema } from "#/api/modules/project/schemas"
import { getTreaty } from "#/lib/api-client"
import { authClient } from "#/lib/auth-client"

export const useCreateProject = () => {
  const queryClient = useQueryClient()
  const { data } = authClient.useActiveOrganization()
  const { mutate, isPending, mutateAsync } = useMutation({
    mutationFn: async (data: Omit<ProjectCreateSchema, "organizationId">) => {
      const response = await getTreaty().project.post(data)
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
