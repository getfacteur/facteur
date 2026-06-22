import { useQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { authClient } from "#/lib/auth-client";
import { requireUserId } from "#/lib/auth-session.server";
import { getMailMeter } from "#/lib/facteur/billing";

const getMailUsage = createServerFn({ method: "POST" }).handler(async () => {
	const userId = await requireUserId();
	return getMailMeter(userId);
});

export const useMailUsage = () => {
	const { data, error } = authClient.useSession();
	if (error) {
		throw new Error(error.message);
	}
	return useQuery({
		queryKey: [data?.user.id, "mail-usage"],
		enabled: !!data?.user.id,
		queryFn: () => getMailUsage(),
	});
};
