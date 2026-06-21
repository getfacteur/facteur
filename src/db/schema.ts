import { createInsertSchema, createSelectSchema } from "drizzle-orm/arktype";
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import { user } from "./schemas/auth";

export {
	account,
	apikey,
	passkey,
	session,
	user,
	verification,
} from "./schemas/auth";

export const domainStatusEnum = pgEnum("domain_status", [
	"pending",
	"verified",
	"error",
]);

export const domain = pgTable("domain", {
	id: text().primaryKey().$defaultFn(v7),
	domain: text().unique().notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
	status: domainStatusEnum("status").notNull(),
	verificationToken: text("verification_token").notNull().unique(),
	verifiedAt: timestamp("verified_at"),
	lastCheckedAt: timestamp("last_checked_at"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.$onUpdateFn(() => new Date()),
});

export const domainInsertSchema = createInsertSchema(domain);
export const domainSelectSchema = createSelectSchema(domain);

type DomainSelect = typeof domainSelectSchema.infer;
export type DomainStatus = DomainSelect["status"];
