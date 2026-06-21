import { useQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { type } from "arktype";
import { authClient } from "#/lib/auth-client";
import { getPlanLimits } from "#/lib/facteur/billing";

const getFixedUsage = createServerFn({ method: "POST" })
	.validator(type({ userId: "string" }))
	.handler(async ({ data }) => {
		return getPlanLimits(data.userId);
	});

export const useFixedUsage = () => {
	const { data, error } = authClient.useSession();
	if (error) {
		throw new Error(error.message);
	}

	return useQuery({
		queryKey: [data?.user.id, "fixed-usage"],
		queryFn: () => getFixedUsage({ data: { userId: data?.user.id ?? "" } }),
		enabled: !!data?.user.id,
	});
};
