export interface DnsResolver {
	getRecord: (type: "TXT", name: string) => Promise<string | null>;
}
