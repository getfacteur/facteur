import { cron } from "inngest";
import { inngest, startDomainVerify } from "../inngest";
import { getAllDomainIds } from "../services/domains";

const EVENT_BATCH_SIZE = 1_000;

export const verifyDomainsDaily = inngest.createFunction(
	{
		id: "domain-verify-daily",
		triggers: [cron("TZ=UTC 0 6 * * *")],
	},
	async ({ step }) => {
		const domains = await step.run("load-domain-ids", getAllDomainIds);

		for (let index = 0; index < domains.length; index += EVENT_BATCH_SIZE) {
			const batch = domains.slice(index, index + EVENT_BATCH_SIZE);
			await step.sendEvent(
				`verify-domain-batch-${index / EVENT_BATCH_SIZE}`,
				batch.map(({ id }) =>
					startDomainVerify.create({ id, source: "scheduled" }),
				),
			);
		}

		return { domainsQueued: domains.length };
	},
);
