import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	account: {
		user: r.one.user({
			from: r.account.userId,
			to: r.user.id,
			optional: false,
		}),
	},
	domain: {
		user: r.one.user({
			from: r.domain.userId,
			to: r.user.id,
			optional: false,
		}),
	},
	dataExportRequest: {
		user: r.one.user({
			from: r.dataExportRequest.userId,
			to: r.user.id,
			optional: false,
		}),
	},
	passkey: {
		user: r.one.user({
			from: r.passkey.userId,
			to: r.user.id,
			optional: false,
		}),
	},
	session: {
		user: r.one.user({
			from: r.session.userId,
			to: r.user.id,
			optional: false,
		}),
	},
	user: {
		accounts: r.many.account({ from: r.user.id, to: r.account.userId }),
		dataExportRequests: r.many.dataExportRequest({
			from: r.user.id,
			to: r.dataExportRequest.userId,
		}),
		domains: r.many.domain({ from: r.user.id, to: r.domain.userId }),
		passkeys: r.many.passkey({ from: r.user.id, to: r.passkey.userId }),
		sessions: r.many.session({ from: r.user.id, to: r.session.userId }),
	},
}));
