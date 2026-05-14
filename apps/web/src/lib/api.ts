import type { App } from "@facteur/server/treaty";
import { treaty } from "@elysia/eden";
import { env } from "@facteur/env/client";

export const apiClient = treaty<App>(env.VITE_SERVER_URL);
