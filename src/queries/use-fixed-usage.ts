import { useQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { authClient } from "#/lib/auth-client";
import { requireUserId } from "#/lib/auth-session.server";
import { getPlanLimits } from "#/lib/facteur/billing";

const getFixedUsage = createServerFn({ method: "POST" }).handler(async () => {
	const userId = await requireUserId();
	return getPlanLimits(userId);
});

export const useFixedUsage = () => {
	const { data, error } = authClient.useSession();
	if (error) {
		throw new Error(error.message);
	}

	return useQuery({
		queryKey: [data?.user.id, "fixed-usage"],
		queryFn: () => getFixedUsage(),
		enabled: !!data?.user.id,
	});
};
