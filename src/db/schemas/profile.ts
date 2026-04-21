import { pgTable, text } from "drizzle-orm/pg-core"
import { v7 } from "uuid"

import { user } from "./auth"

export const profile = pgTable("profile", {
  id: text()
    .primaryKey()
    .$defaultFn(() => v7()),
  userId: text()
    .notNull()
    .unique()
    .references(() => user.id),
  lastActiveOrganization: text(),
})
