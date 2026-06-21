import { env } from "#/lib/env.server";
import { Cloudflare } from "./cloudflare";
import type { DnsResolver } from "./dns";
import { Google } from "./google";

export function createDnsResolver(): DnsResolver {
	switch (env.DNS_RESOLVER) {
		case "cloudflare":
			return new Cloudflare();
		case "google":
			return new Google();
	}
}
