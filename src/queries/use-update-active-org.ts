import { useMutation } from "@tanstack/react-query"

import { getTreaty } from "#/lib/api-client"

const getErrorMessage = (error: unknown) => {
  if (!error) {
    return "Unknown error"
  }

  if (typeof error === "string") {
    return error
  }

  if (typeof error === "object" && "value" in error) {
    const value = error.value
    if (
      typeof value === "object" &&
      value &&
      "message" in value &&
      typeof value.message === "string"
    ) {
      return value.message
    }
    if (typeof value === "string") {
      return value
    }
    return JSON.stringify(value)
  }

  return JSON.stringify(error)
}

export const useUpdateActiveOrg = () => {
  const { mutate, isPending, mutateAsync } = useMutation({
    mutationFn: async (organizationId: string) => {
      const response = await getTreaty()["update-active-org"].post({ organizationId })
      if (response.error) {
        throw new Error(getErrorMessage(response.error))
      }
      return response.data
    },
  })

  return { mutate, isPending, mutateAsync }
}
