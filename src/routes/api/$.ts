import { createFileRoute } from "@tanstack/react-router";
import { apiHandlers } from "#/lib/api.server";

export const Route = createFileRoute("/api/$")({
	server: {
		handlers: apiHandlers,
	},
});
