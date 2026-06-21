import { useMutation } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { type } from "arktype";
import { authClient } from "#/lib/auth-client";
import { createDomain } from "#/lib/services/domains";

const saveDomainSchema = type({ userId: "string", domain: "string" });

const saveDomain = createServerFn({ method: "POST" })
	.validator(saveDomainSchema)
	.handler(async ({ data }) => createDomain(data.userId, data.domain));

export const useCreateDomain = () => {
	const { data, error } = authClient.useSession();
	if (error) {
		throw new Error(error.message);
	}
	return useMutation({
		mutationKey: ["domain", "create"],
		mutationFn: (domain: string) =>
			saveDomain({ data: { userId: data?.user.id ?? "", domain } }),
	});
};
