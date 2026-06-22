import { cron } from "inngest";
import { inngest, startDomainVerify } from "../inngest";
import { getDomainIdsPage } from "../services/domains";

const EVENT_BATCH_SIZE = 1_000;

export const verifyDomainsDaily = inngest.createFunction(
	{
		id: "domain-verify-daily",
		triggers: [cron("TZ=UTC 0 6 * * *")],
	},
	async ({ step }) => {
		let cursor: string | undefined;
		let domainsQueued = 0;
		let page = 0;

		while (true) {
			const domains = await step.run(`load-domain-id-page-${page}`, () =>
				getDomainIdsPage(cursor, EVENT_BATCH_SIZE),
			);
			if (domains.length === 0) {
				break;
			}

			await step.sendEvent(
				`verify-domain-batch-${page}`,
				domains.map(({ id }) =>
					startDomainVerify.create({ id, source: "scheduled" }),
				),
			);
			domainsQueued += domains.length;

			if (domains.length < EVENT_BATCH_SIZE) {
				break;
			}

			const lastDomain = domains.at(-1);
			if (!lastDomain) {
				break;
			}
			cursor = lastDomain.id;
			page += 1;
		}

		return { domainsQueued };
	},
);
