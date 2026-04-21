import { treaty } from "@elysiajs/eden"
import { createClientOnlyFn } from "@tanstack/react-start"

import type { App } from "#/routes/api.$"

export const getTreaty = createClientOnlyFn(() => treaty<App>(window.location.origin).api)
