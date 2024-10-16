// src/auth.ts
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
    ],
    callbacks: {
        // JWT Callback: Persist the access token in the JWT
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.expires_at = account.expires_at;
            }
            return token;
        },
        // Session Callback: Make the access token available in the session
        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            return session;
        },
    },
    // It's a good practice to set a secret for NextAuth
    secret: process.env.NEXTAUTH_SECRET,
};

export async function getServerAuthSession() {
    const session = await getServerSession(authOptions);
    return session;
}
