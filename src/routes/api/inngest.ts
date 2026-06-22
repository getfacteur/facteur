import { createFileRoute } from "@tanstack/react-router";
import { serve } from "inngest/edge";
import { notifyDomainInvalidated } from "#/lib/functions/notify-domain-invalidated";
import { verifyDomain } from "#/lib/functions/verify-domain";
import { verifyDomainsDaily } from "#/lib/functions/verify-domains-daily";
import { inngest } from "#/lib/inngest";

const handler = serve({
	client: inngest,
	functions: [verifyDomain, verifyDomainsDaily, notifyDomainInvalidated],
});

export const Route = createFileRoute("/api/inngest")({
	server: {
		handlers: {
			GET: async ({ request }) => handler(request),
			POST: async ({ request }) => handler(request),
			PUT: async ({ request }) => handler(request),
		},
	},
});
