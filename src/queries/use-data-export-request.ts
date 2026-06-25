import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { authClient } from "#/lib/auth-client";
import { requireUserId } from "#/lib/auth-session.server";
import {
	getPendingDataExportRequest,
	requestDataExport,
} from "#/lib/services/data-export-requests";

const dataExportRequestQueryKey = (userId: string | undefined) =>
	[userId, "data-export-request"] as const;

const getDataExportRequest = createServerFn({ method: "POST" }).handler(
	async () => {
		const userId = await requireUserId();
		return getPendingDataExportRequest(userId);
	},
);

const createDataExportRequest = createServerFn({ method: "POST" }).handler(
	async () => {
		const userId = await requireUserId();
		return requestDataExport(userId);
	},
);

export const useDataExportRequest = () => {
	const { data } = authClient.useSession();

	return useQuery({
		queryKey: dataExportRequestQueryKey(data?.user.id),
		enabled: !!data?.user.id,
		queryFn: () => getDataExportRequest(),
	});
};

export const useRequestDataExport = () => {
	const { data } = authClient.useSession();
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["data-export-request", "create"],
		mutationFn: () => createDataExportRequest(),
		onSuccess: async (request) => {
			if (data?.user.id) {
				queryClient.setQueryData(
					dataExportRequestQueryKey(data.user.id),
					request,
				);
			}
			await queryClient.invalidateQueries({
				queryKey: dataExportRequestQueryKey(data?.user.id),
			});
		},
	});
};
