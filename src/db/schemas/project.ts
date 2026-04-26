import { pgTable, text, timestamp, unique } from "drizzle-orm/pg-core"
import { v7 } from "uuid"

import { organization } from "./auth"
export const project = pgTable(
  "project",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => v7()),
    name: text().notNull(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [unique("organization_project_name").on(table.name, table.organizationId)],
)
