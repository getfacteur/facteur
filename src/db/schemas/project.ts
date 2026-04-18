import { pgTable, text, unique } from "drizzle-orm/pg-core"
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
  },
  (table) => [unique("organization_project_name").on(table.name, table.organizationId)],
)
