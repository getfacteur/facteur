import { useMutation } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { type } from "arktype";
import { authClient } from "#/lib/auth-client";
import { deleteDomain } from "#/lib/services/domains";

const removeDomainSchema = type({ userId: "string", domain: "string" });

const removeDomain = createServerFn({ method: "POST" })
	.validator(removeDomainSchema)
	.handler(async ({ data }) => deleteDomain(data.userId, data.domain));

export const useDeleteDomain = () => {
	const { data, error } = authClient.useSession();
	if (error) {
		throw new Error(error.message);
	}
	return useMutation({
		mutationKey: ["domain", "delete"],
		mutationFn: (domain: string) =>
			removeDomain({ data: { userId: data?.user.id ?? "", domain } }),
	});
};
