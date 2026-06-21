import { useQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { type } from "arktype";
import { authClient } from "#/lib/auth-client";
import { getDomains } from "#/lib/services/domains";

const listDomains = createServerFn()
	.validator(type({ userId: "string" }))
	.handler(async ({ data }) => getDomains(data.userId));

export const useDomains = () => {
	const { data, error } = authClient.useSession();
	if (error) {
		throw new Error(error.message);
	}

	return useQuery({
		queryKey: ["domain", "list"],
		enabled: !!data?.user.id,
		queryFn: () => listDomains({ data: { userId: data?.user.id ?? "" } }),
	});
};

export type UseDomainsData = ReturnType<typeof useDomains>["data"];
export type Domain = NonNullable<UseDomainsData>[number];
