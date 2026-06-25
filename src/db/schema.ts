import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-orm/arktype";
import {
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";
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

export const dataExportRequestStatusEnum = pgEnum(
	"data_export_request_status",
	["pending", "fulfilled", "canceled"],
);

export const domain = pgTable("domain", {
	id: text().primaryKey().$defaultFn(v7),
	domain: text().unique().notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	status: domainStatusEnum("status").notNull(),
	verificationToken: text("verification_token").notNull().unique(),
	verifiedAt: timestamp("verified_at"),
	lastCheckedAt: timestamp("last_checked_at"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.$onUpdateFn(() => new Date()),
});

export const dataExportRequest = pgTable(
	"data_export_request",
	{
		id: text().primaryKey().$defaultFn(v7),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		status: dataExportRequestStatusEnum("status").notNull().default("pending"),
		createdAt: timestamp("created_at")
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: timestamp("updated_at")
			.notNull()
			.$defaultFn(() => new Date())
			.$onUpdateFn(() => new Date()),
	},
	(table) => [
		uniqueIndex("data_export_request_pending_user_id_idx")
			.on(table.userId)
			.where(sql.raw("\"status\" = 'pending'")),
	],
);

export const domainInsertSchema = createInsertSchema(domain);
export const domainSelectSchema = createSelectSchema(domain);
export const dataExportRequestSelectSchema =
	createSelectSchema(dataExportRequest);

type DomainSelect = typeof domainSelectSchema.infer;
export type DomainStatus = DomainSelect["status"];
type DataExportRequestSelect = typeof dataExportRequestSelectSchema.infer;
export type DataExportRequestStatus = DataExportRequestSelect["status"];
