import { domainInvalidated, inngest, startDomainVerify } from "../inngest";
import { createDnsResolver } from "../services/dns/factory";
import {
	getDomain,
	getDomainVerifaction,
	updateDomainStatus,
} from "../services/domains";

export const verifyDomain = inngest.createFunction(
	{
		id: "domain-verify",
		triggers: [startDomainVerify],
		concurrency: { limit: 1, key: "event.data.id" },
	},
	async ({ event, logger, step }) => {
		const domain = await step.run("load-domain", async () => {
			const result = await getDomain(event.data.id);
			if (!result) {
				return null;
			}
			return {
				id: result.id,
				domain: result.domain,
				status: result.status,
				verificationToken: result.verificationToken,
			};
		});
		if (!domain) {
			logger.error(`no domain found for id ${event.data.id}`);
			return;
		}
		logger.info(`found domain for id ${event.data.id}`);

		const nextStatus = await step.run("check-domain-dns", async () => {
			const resolver = createDnsResolver();
			const record = await resolver.getRecord(
				"TXT",
				`_facteur-relay.${domain.domain}`,
			);
			const value = record ? getDomainVerifaction(record) : undefined;
			return value === domain.verificationToken ? "verified" : "error";
		});

		await step.run("update-domain-status", async () => {
			await updateDomainStatus(domain.id, nextStatus);
		});

		if (
			event.data.source === "scheduled" &&
			domain.status === "verified" &&
			nextStatus === "error"
		) {
			await step.sendEvent(
				"notify-domain-invalidated",
				domainInvalidated.create({ domainId: domain.id }),
			);
		}
	},
);
