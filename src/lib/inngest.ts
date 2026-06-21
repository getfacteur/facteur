import { type } from "arktype";
import { eventType, Inngest } from "inngest";

export const startDomainVerify = eventType("app/domain.verify", {
	schema: type({
		id: "string",
		source: "'initial' | 'manual' | 'scheduled'",
	}),
});

export const domainInvalidated = eventType("app/domain.invalidated", {
	schema: type({
		domainId: "string",
	}),
});

// Create a client to send and receive events
export const inngest = new Inngest({ id: "facteur" });
