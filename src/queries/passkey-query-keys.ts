export const passkeyListQueryPrefix = ["passkeys"] as const;
export const passkeyListQueryKey = (userId: string | undefined) =>
	[...passkeyListQueryPrefix, userId] as const;
