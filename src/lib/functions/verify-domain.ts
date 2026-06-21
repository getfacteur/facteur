import { inngest, startDomainVerify } from "../inngest";
import { Cloudflare } from "../services/dns/cloudflare";
import {
	getDomain,
	getDomainVerifaction,
	updateDomainStatus,
} from "../services/domains";

export const verifyDomain = inngest.createFunction(
	{ id: "domain-verify", triggers: [startDomainVerify] },
	async ({ event, logger }) => {
		const domain = await getDomain(event.data.id);
		if (!domain) {
			logger.error(`no domain found for id ${event.data.id}`);
			return;
		}
		logger.info(`found domain for id ${event.data.id}`);
		const resolver = new Cloudflare();
		const res = await resolver.getRecord(
			"TXT",
			`_facteur-relay.${domain.domain}`,
		);
		if (!res) {
			await updateDomainStatus(domain.id, "error");
			return;
		}
		const value = getDomainVerifaction(res);
		console.log(value);
		if (value === domain.verificationToken) {
			await updateDomainStatus(domain.id, "verified");
		} else {
			await updateDomainStatus(domain.id, "error");
		}
	},
);
