// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/auth";
import {
    NextApiRequest,
    NextApiResponse
} from "next";
import {
    NextRequest,
    NextResponse
} from "next/server";

async function handler(
    req: NextRequest | NextApiRequest,
    res?: NextApiResponse
): Promise<Response | NextResponse> {
    if (!process.env.NEXTAUTH_SECRET) {
        throw new Error('Please set NEXTAUTH_SECRET environment variable');
    }

    const nextAuthHandler = NextAuth(authOptions);

    // Handle both Edge and Node.js environments
    if (res) {
        // Node.js API Route style
        return nextAuthHandler(req as NextApiRequest, res);
    } else {
        // Edge Runtime style
        return nextAuthHandler(req as NextRequest);
    }
}

export const GET = handler;
export const POST = handler;