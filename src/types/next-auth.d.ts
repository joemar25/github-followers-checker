// types/next-auth.d.ts

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        accessToken?: string;
    }

    interface User {
        accessToken?: string;

    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
    }
}
