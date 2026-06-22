import { useQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { authClient } from "#/lib/auth-client";
import { requireUserId } from "#/lib/auth-session.server";
import { getDomains } from "#/lib/services/domains";
import { domainListQueryKey } from "./domain-query-keys";

const listDomains = createServerFn().handler(async () => {
	const userId = await requireUserId();
	return getDomains(userId);
});

export const useDomains = () => {
	const { data, error } = authClient.useSession();
	if (error) {
		throw new Error(error.message);
	}

	return useQuery({
		queryKey: domainListQueryKey(data?.user.id),
		enabled: !!data?.user.id,
		queryFn: () => listDomains(),
	});
};

export type UseDomainsData = ReturnType<typeof useDomains>["data"];
export type Domain = NonNullable<UseDomainsData>[number];
