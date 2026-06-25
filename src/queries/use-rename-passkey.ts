import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { type } from "arktype";
import { auth } from "#/lib/auth";
import { passkeyListQueryPrefix } from "./passkey-query-keys";

const renamePasskeySchema = type({
	id: "string",
	name: "string",
});

const renamePasskey = createServerFn({ method: "POST" })
	.validator(renamePasskeySchema)
	.handler(async ({ data }) => {
		return auth.api.updatePasskey({
			headers: getRequestHeaders(),
			body: data,
		});
	});

export const useRenamePasskey = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["passkeys", "rename"],
		mutationFn: ({ id, name }: { id: string; name: string }) =>
			renamePasskey({ data: { id, name } }),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: passkeyListQueryPrefix,
				exact: false,
			});
		},
	});
};
