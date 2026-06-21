import { type } from "arktype";

const envBoolean = type("'true' | 'false'").pipe((value) => value === "true");

const envSchema = type({
	INNGEST_SIGNING_KEY: "string?",
	INNGEST_DEV: "'0' | '1'",
	DNS_RESOLVER: type("'cloudflare' | 'google'").default("cloudflare"),
	DATABASE_URL: "string",
	BETTER_AUTH_SECRET: "string",
	BETTER_AUTH_URL: "string",
	POLAR_ACCESS_TOKEN: "string",
	POLAR_WEBHOOK_SECRET: "string",
	POLAR_FREE_PRODUCT_ID: "string",
	POLAR_MAIL_METER_ID: "string",
	POLAR_FREE_DOMAIN_LIMIT: "string.numeric.parse?",
	POLAR_FREE_PROVIDER_LIMIT: "string.numeric.parse?",
	SMTP_USER: "string",
	SMTP_PASS: "string",
	SMTP_HOST: "string",
	SMTP_PORT: "string.numeric.parse",
	SMTP_FROM: "string.email",
	SMTP_SECURE: envBoolean.default("true"),
});

export const env = envSchema.assert(process.env);
