import { apiKey } from "@better-auth/api-key";
import { passkey } from "@better-auth/passkey";
import {
	checkout,
	polar,
	portal,
	usage,
	webhooks,
} from "@polar-sh/better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";
import { render, toPlainText } from "react-email";
import { db } from "#/db";
import * as schema from "#/db/schema";
import MagicLink from "#/emails/magic-link";
import { env } from "./env.server";
import { sendMail } from "./mail";
import { polarClient } from "./polar";

const authUrl = new URL(env.BETTER_AUTH_URL);

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: schema,
	}),
	databaseHooks: {
		user: {
			create: {
				async after(user) {
					await polarClient.subscriptions.create({
						externalCustomerId: user.id,
						productId: env.POLAR_FREE_PRODUCT_ID,
					});
				},
			},
		},
	},
	plugins: [
		apiKey(),
		passkey({
			origin: authUrl.origin,
			rpID: authUrl.hostname,
			rpName: "Facteur",
		}),
		polar({
			client: polarClient,
			createCustomerOnSignUp: true,
			use: [
				checkout({ products: [], authenticatedUsersOnly: true }),
				portal(),
				usage(),
				webhooks({
					secret: env.POLAR_WEBHOOK_SECRET,
				}),
			],
		}),
		magicLink({
			async sendMagicLink(data) {
				const html = await render(MagicLink(data));
				const text = toPlainText(html);
				await sendMail(data.email, "Login to Facteur", html, text);
			},
		}),
	],
});
