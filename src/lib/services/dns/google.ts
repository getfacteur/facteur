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

export class Google implements DnsResolver {
	endpoint = "https://dns.google/resolve";

	async getRecord(type: "TXT", name: string) {
		const response = await betterFetch(this.endpoint, {
			query: {
				name,
				type,
			},
			output: responseSchema,
		});

		if (response.error) {
			throw new Error("Google DNS lookup failed", {
				cause: response.error,
			});
		}

		return response.data.Answer?.[0]?.data ?? null;
	}
}
