/**
 * Copyright (c) 2026 Joemar Jane Cardiño. All rights reserved.
 * Proprietary and Confidential. Unauthorized copying of this file is strictly prohibited.
 */

// src\lib\actions\index.ts

import { signIn, signOut } from "next-auth/react";

export async function githubLogin() {
    await signIn('github', { callbackUrl: "/dashboard" });
}

export async function logout() {
    await signOut({ callbackUrl: "/" });
}
