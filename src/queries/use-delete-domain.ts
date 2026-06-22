import { useMutation } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { type } from "arktype";
import { requireUserId } from "#/lib/auth-session.server";
import { deleteDomain } from "#/lib/services/domains";

const removeDomainSchema = type({ domainId: "string" });

const removeDomain = createServerFn({ method: "POST" })
	.validator(removeDomainSchema)
	.handler(async ({ data }) => {
		const userId = await requireUserId();
		return deleteDomain(userId, data.domainId);
	});

export const useDeleteDomain = () => {
	return useMutation({
		mutationKey: ["domain", "delete"],
		mutationFn: (domainId: string) => removeDomain({ data: { domainId } }),
	});
};
