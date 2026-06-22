import { useMutation } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { type } from "arktype";
import { requireUserId } from "#/lib/auth-session.server";
import { createDomain } from "#/lib/services/domains";

const saveDomainSchema = type({ domain: "string" });

const saveDomain = createServerFn({ method: "POST" })
	.validator(saveDomainSchema)
	.handler(async ({ data }) => {
		const userId = await requireUserId();
		return createDomain(userId, data.domain);
	});

export const useCreateDomain = () => {
	return useMutation({
		mutationKey: ["domain", "create"],
		mutationFn: (domain: string) => saveDomain({ data: { domain } }),
	});
};
