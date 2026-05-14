import { pgTable, text } from "drizzle-orm/pg-core";
import { v7 } from "uuid";

export const profile = pgTable("profile", {
  id: text()
    .primaryKey()
    .$defaultFn(() => v7()),
});
