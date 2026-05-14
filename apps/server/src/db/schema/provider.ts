import { jsonb, pgEnum, pgTable, text, unique } from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import { user } from "./auth";

export const typeEnum = pgEnum("providerType", ["resend", "smtp"]);

export const provider = pgTable(
  "provider",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => v7()),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text().notNull(),
    slug: text().notNull(),
    type: typeEnum().notNull(),
    config: jsonb().notNull(),
  },
  (table) => [unique().on(table.userId, table.slug)],
);
