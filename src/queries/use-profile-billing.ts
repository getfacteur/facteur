import { useQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { authClient } from "#/lib/auth-client";
import { requireUserId } from "#/lib/auth-session.server";
import { getProfileBilling } from "#/lib/facteur/billing";

const getProfileBillingSummary = createServerFn({ method: "POST" }).handler(
	async () => {
		const userId = await requireUserId();
		return getProfileBilling(userId);
	},
);

export const useProfileBilling = () => {
	const { data } = authClient.useSession();

	return useQuery({
		queryKey: [data?.user.id, "profile-billing"],
		enabled: !!data?.user.id,
		queryFn: () => getProfileBillingSummary(),
	});
};
