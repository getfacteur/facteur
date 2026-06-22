import { useMutation } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { type } from "arktype";
import { requireUserId } from "#/lib/auth-session.server";
import { verifyDomain } from "#/lib/services/domains";

const domainVerifySchema = type({ domainId: "string" });

const triggerDomainVerify = createServerFn({ method: "POST" })
	.validator(domainVerifySchema)
	.handler(async ({ data }) => {
		const userId = await requireUserId();
		await verifyDomain(userId, data.domainId);
	});

export const useVerifyDomain = () => {
	return useMutation({
		mutationKey: ["domain", "verify"],
		mutationFn: (domainId: string) =>
			triggerDomainVerify({
				data: { domainId },
			}),
	});
};
