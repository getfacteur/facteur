import { createFormHook, createFormHookContexts } from "@tanstack/react-form"

import { TextInput } from "#/components/forms/text-input"

export const { fieldContext, formContext, useFieldContext } = createFormHookContexts()

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextInput,
  },
  formComponents: {},
})
