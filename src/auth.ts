/**
 * Copyright (c) 2026 Joemar Jane Cardiño. All rights reserved.
 * Proprietary and Confidential. Unauthorized copying of this file is strictly prohibited.
 */

// auth.ts
import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID ?? '',
            clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
            authorization: {
                params: {
                    scope: 'read:user user:follow'
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account?.access_token) {
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session, token }) {
            return {
                ...session,
                accessToken: token.accessToken
            };
        }
    },
    pages: {
        signIn: '/'
    }
};