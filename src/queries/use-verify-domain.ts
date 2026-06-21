import { useMutation } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { type } from "arktype";
import { inngest, startDomainVerify } from "#/lib/inngest";

const domainVerifySchema = type({ domainId: "string" });
type DomainVerify = typeof domainVerifySchema.infer;

const triggerDomainVerify = createServerFn({ method: "POST" })
	.validator(domainVerifySchema)
	.handler(async ({ data }) => {
		await inngest.send(startDomainVerify.create({ id: data.domainId }));
	});

export const useVerifyDomain = () => {
	return useMutation({
		mutationKey: ["domain", "verify"],
		mutationFn: (data: DomainVerify) => triggerDomainVerify({ data }),
	});
};
