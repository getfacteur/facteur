import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { TextField } from "@/components/forms/text-field";

export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  // We'll learn more about these options later
  fieldComponents: {
    TextField,
  },
  formComponents: {},
});
