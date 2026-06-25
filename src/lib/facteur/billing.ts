import { env } from "../env.server";
import { polarClient } from "../polar";
import { countDomains } from "../services/domains";
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
	return {
		current_domains: domainCount,
		max_domains: config.limits.domains,
	};
};

export const getProfileBilling = async (userId: string) => {
	const userState = await polarClient.customers.getStateExternal({
		externalId: userId,
	});
	const subscription =
		userState.activeSubscriptions.find((sub) => sub.status === "active") ??
		userState.activeSubscriptions[0] ??
		null;
	const config = subscription
		? getPlanConfig(subscription.productId)
		: undefined;
	const mailMeter = userState.activeMeters.find(
		(meter) => meter.meterId === env.POLAR_MAIL_METER_ID,
	);
	const domainCount = await countDomains(userId);

	return {
		customer: {
			id: userState.id,
			email: userState.email ?? null,
			name: userState.name ?? null,
		},
		plan: {
			name: config?.name ?? "Unknown plan",
			slug: config?.slug ?? "unknown",
			productId: subscription?.productId ?? null,
			status: subscription?.status ?? "none",
			currentPeriodEnd: subscription?.currentPeriodEnd?.toISOString() ?? null,
			cancelAtPeriodEnd: subscription?.cancelAtPeriodEnd ?? false,
			overage: config?.overage ?? false,
		},
		limits: {
			domains: {
				current: domainCount,
				max: config?.limits.domains ?? null,
			},
			mailCredits: mailMeter
				? {
						consumed: mailMeter.consumedUnits,
						credited: mailMeter.creditedUnits,
						balance: mailMeter.balance,
					}
				: null,
		},
	};
};
