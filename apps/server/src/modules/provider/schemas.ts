import z from "zod";

export const providerCreateSchema = z.object({
  name: z.string(),
  type: z.enum(["resend", "smtp"]),
  config: z.object({}),
});

export const providerUpdateSchema = z.object({
  name: z.string().optional(),
  type: z.enum(["resend", "smtp"]).optional(),
  config: z.object({}).optional(),
});

export type ProviderCreateSchema = z.infer<typeof providerCreateSchema>;
export type ProviderUpdateSchema = z.infer<typeof providerUpdateSchema>;
