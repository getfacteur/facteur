import { useMutation } from "@tanstack/react-query"

import { getTreaty } from "#/lib/api-client"

export const useUpdateActiveOrg = () => {
  const { mutate, isPending, mutateAsync } = useMutation({
    mutationFn: (organizationId: string) =>
      getTreaty()["update-active-org"].post({ organizationId }),
  })

  return { mutate, isPending, mutateAsync }
}
