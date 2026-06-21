import { useQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { type } from "arktype";
import { authClient } from "#/lib/auth-client";
import { getMailMeter } from "#/lib/facteur/billing";

const getMailUsage = createServerFn({ method: "POST" })
	.validator(type({ userId: "string" }))
	.handler(({ data: { userId } }) => getMailMeter(userId));

export const useMailUsage = () => {
	const { data, error } = authClient.useSession();
	if (error) {
		throw new Error(error.message);
	}
	return useQuery({
		queryKey: [data?.user.id, "mail-usage"],
		enabled: !!data?.user.id,
		queryFn: () => getMailUsage({ data: { userId: data?.user.id ?? "" } }),
	});
};
