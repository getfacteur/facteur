import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { authClient } from "./auth-client";

export const getSession = createIsomorphicFn()
	.server(() =>
		authClient.getSession({
			fetchOptions: {
				headers: getRequestHeaders(),
			},
		}),
	)
	.client(() => authClient.getSession());
