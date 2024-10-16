import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function PUT(req: NextRequest, { params }: { params: { username: string } }) {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
        return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
    }

    const { username } = params;
    if (!username) {
        return NextResponse.json({ error: "Username is required." }, { status: 400 });
    }

    try {
        await axios.put(
            `https://api.github.com/user/following/${username}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    Accept: "application/vnd.github+json",
                    "X-GitHub-Api-Version": "2022-11-28",
                },
            }
        );
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Error following user:", error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data.message || "Failed to follow user." }, { status: error.response.status });
        }
        return NextResponse.json({ error: "Failed to follow user." }, { status: 500 });
    }
}