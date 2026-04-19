import type { HTMLInputAutoCompleteAttribute, HTMLInputTypeAttribute } from "react"

import { useFieldContext } from "#/hooks/use-app-form"

import { Field, FieldError, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"

interface Props {
  label: string
  type?: HTMLInputTypeAttribute
  autocomplete?: HTMLInputAutoCompleteAttribute
  disabled?: boolean
}

export const TextInput = ({
  label,
  type = "text",
  autocomplete = "off",
  disabled = false,
}: Props) => {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        type={type}
        autoComplete={autocomplete}
        disabled={disabled}
      />

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
