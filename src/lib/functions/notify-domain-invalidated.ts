import { render, toPlainText } from "react-email";
import DomainInvalidated from "#/emails/domain-invalidated";
import { env } from "../env.server";
import { domainInvalidated, inngest } from "../inngest";
import { sendMail } from "../mail";
import { getDomainWithOwner } from "../services/domains";

export const notifyDomainInvalidated = inngest.createFunction(
	{
		id: "domain-invalidated-notification",
		triggers: [domainInvalidated],
	},
	async ({ event, logger, step }) => {
		await step.run("send-domain-invalidated-email", async () => {
			const domain = await getDomainWithOwner(event.data.domainId);
			if (!domain) {
				logger.info(`domain ${event.data.domainId} no longer exists`);
				return;
			}
			if (domain.status !== "error") {
				logger.info(`domain ${event.data.domainId} is no longer invalid`);
				return;
			}

			const url = new URL("/domains", env.BETTER_AUTH_URL).toString();
			const html = await render(
				DomainInvalidated({ domain: domain.domain, url }),
			);
			const text = toPlainText(html);
			await sendMail(
				domain.userEmail,
				`Action required: ${domain.domain} is no longer verified`,
				html,
				text,
			);
		});
	},
);
