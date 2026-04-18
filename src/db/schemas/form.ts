import { pgTable, text, unique } from "drizzle-orm/pg-core"
import { v7 } from "uuid"

import { project } from "./project"

export const form = pgTable(
  "form",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => v7()),
    name: text().notNull(),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id),
    redirectUrl: text(),
    allowedOrigins: text().array().notNull(),
    webhookUrl: text(),
  },
  (table) => [unique("project_form_name").on(table.name, table.projectId)],
)
