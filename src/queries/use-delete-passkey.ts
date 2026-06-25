import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { type } from "arktype";
import { auth } from "#/lib/auth";
import { passkeyListQueryPrefix } from "./passkey-query-keys";

const deletePasskeySchema = type({
	id: "string",
});

const removePasskey = createServerFn({ method: "POST" })
	.validator(deletePasskeySchema)
	.handler(async ({ data }) => {
		return auth.api.deletePasskey({
			headers: getRequestHeaders(),
			body: data,
		});
	});

export const useDeletePasskey = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["passkeys", "delete"],
		mutationFn: (id: string) => removePasskey({ data: { id } }),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: passkeyListQueryPrefix,
				exact: false,
			});
		},
	});
};
