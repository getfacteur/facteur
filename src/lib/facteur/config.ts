import { env } from "../env.server";

const config = {
	plans: [
		{
			name: "Free",
			slug: "free",
			polarId: env.POLAR_FREE_PRODUCT_ID,
			limits: {
				domains: env.POLAR_FREE_DOMAIN_LIMIT ?? 1,
				providers: env.POLAR_FREE_PROVIDER_LIMIT ?? 1,
			},
			overage: false,
		},
	],
};

export const getPlanConfig = (planId: string) => {
	return config.plans.find((p) => p.polarId === planId);
};
