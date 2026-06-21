import { apiKeyClient } from "@better-auth/api-key/client";
import { passkeyClient } from "@better-auth/passkey/client";
import { polarClient } from "@polar-sh/better-auth/client";
import { magicLinkClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
	plugins: [apiKeyClient(), passkeyClient(), magicLinkClient(), polarClient()],
});
