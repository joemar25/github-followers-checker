// src\lib\actions\index.ts

import { signIn, signOut } from "next-auth/react";

export async function githubLogin() {
    await signIn('github', { callbackUrl: "/dashboard" });
}

export async function doLogout() {
    await signOut({ callbackUrl: "/" });
}
