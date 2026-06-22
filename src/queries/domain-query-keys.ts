export const domainListQueryPrefix = ["domain", "list"] as const;

export const domainListQueryKey = (userId: string | undefined) =>
	[...domainListQueryPrefix, userId] as const;
