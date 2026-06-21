import { env } from "../env.server";
import { polarClient } from "../polar";
import { countDomains } from "../services/domains";
import { countProviders } from "../services/providers";
import { getPlanConfig } from "./config";

export const getMailMeter = async (userId: string) => {
	const mailMeterId = env.POLAR_MAIL_METER_ID;
	const userState = await polarClient.customers.getStateExternal({
		externalId: userId,
	});
	const userMeter = userState.activeMeters.find(
		(met) => met.meterId === mailMeterId,
	);
	if (!userMeter) {
		throw new Error("meter_not_found");
	}
	return userMeter;
};

export const getPlanLimits = async (userId: string) => {
	const userState = await polarClient.customers.getStateExternal({
		externalId: userId,
	});
	const subscription = userState.activeSubscriptions.find(
		(s) => s.status === "active",
	);
	if (!subscription) {
		throw new Error("subscription_not_found");
	}
	const config = getPlanConfig(subscription.productId);
	if (!config) {
		throw new Error("plan_config_not_found");
	}
	const domainCount = await countDomains(userId);
	const providerCount = await countProviders(userId);
	return {
		current_domains: domainCount,
		current_providers: providerCount,
		max_domains: config.limits.domains,
		max_providers: config.limits.providers,
	};
};
