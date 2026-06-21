import { betterFetch } from "@better-fetch/fetch";
import { type } from "arktype";
import type { DnsResolver } from "./dns";

const answerSchema = type({
	name: "string",
	data: "string",
});

const responseSchema = type({
	"Answer?": answerSchema.array(),
});

export class Cloudflare implements DnsResolver {
	endpoint = "https://cloudflare-dns.com/dns-query";

	async getRecord(type: "TXT", name: string) {
		const response = await betterFetch(this.endpoint, {
			headers: {
				accept: "application/dns-json",
			},
			query: {
				name,
				type,
			},
			onResponse: async ({ response }) => {
				const headers = new Headers(response.headers);
				const contentType = headers.get("content-type")?.toLowerCase();
				if (!contentType?.startsWith("application/dns-json")) {
					return;
				}

				headers.set("content-type", "application/json");
				return new Response(await response.text(), {
					status: response.status,
					statusText: response.statusText,
					headers,
				});
			},
			output: responseSchema,
		});

		if (response.error) {
			throw new Error("Cloudflare DNS lookup failed", {
				cause: response.error,
			});
		}

		return response.data.Answer?.[0]?.data ?? null;
	}
}
