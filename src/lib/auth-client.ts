import { polarClient } from "@polar-sh/better-auth/client";

import { createAuthClient } from "better-auth/react"


export const authClient = createAuthClient({
    plugins: [polarClient() as any]
});


export const { signIn, signUp, signOut, useSession } = authClient;