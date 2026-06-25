import { useMutation } from "@tanstack/react-query";
import { authClient } from "#/lib/auth-client";

export const useCustomerPortal = () => {
	return useMutation({
		mutationKey: ["customer-portal"],
		mutationFn: async () => {
			const result = await authClient.customer.portal();

			if (result.error) {
				throw new Error(
					result.error.message ??
						result.error.statusText ??
						"Unable to open billing portal.",
				);
			}

			if (!result.data?.url) {
				throw new Error("Unable to open billing portal.");
			}

			return result.data;
		},
	});
};
