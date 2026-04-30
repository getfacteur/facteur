import { type } from "arktype"

export const projectCreateSchema = type({
  name: "string",
  organizationId: "string",
})

export const projectUpdateSchema = type({
  name: "string",
})

export type ProjectCreateSchema = typeof projectCreateSchema.infer
export type ProjectUpdateSchema = typeof projectUpdateSchema.infer
