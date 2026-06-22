import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "./auth";

export const requireUserId = async () => {
	const session = await auth.api.getSession({
		headers: getRequestHeaders(),
	});

	if (!session) {
		throw new Error("unauthorized");
	}

	return session.user.id;
};
