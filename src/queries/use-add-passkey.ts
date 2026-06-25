import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "#/lib/auth-client";
import { passkeyListQueryPrefix } from "./passkey-query-keys";

export const useAddPasskey = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["passkeys", "add"],
		mutationFn: async (name?: string) => {
			const result = await authClient.passkey.addPasskey({ name });
			if (result.error) {
				throw new Error(
					result.error.message ??
						result.error.statusText ??
						"Unable to add passkey.",
				);
			}
			return result.data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: passkeyListQueryPrefix,
				exact: false,
			});
		},
	});
};
