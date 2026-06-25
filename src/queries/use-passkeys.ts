import { useQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "#/lib/auth";
import { authClient } from "#/lib/auth-client";
import { passkeyListQueryKey } from "./passkey-query-keys";

const listPasskeys = createServerFn({ method: "GET" }).handler(async () => {
	return auth.api.listPasskeys({
		headers: getRequestHeaders(),
	});
});

export const usePasskeys = () => {
	const { data } = authClient.useSession();

	return useQuery({
		queryKey: passkeyListQueryKey(data?.user.id),
		enabled: !!data?.user.id,
		queryFn: listPasskeys,
	});
};
