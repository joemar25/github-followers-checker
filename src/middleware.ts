// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware() {
        // console.log(req);

        // Add any custom middleware logic here if needed
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ req, token }) => {
                // Only allow access to protected routes if user is authenticated
                if (req.nextUrl.pathname.startsWith("/dashboard")) {
                    return !!token;
                }
                return true;
            },
        },
    }
);

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/api/followers",
        "/api/following",
        "/api/following/:path*"
    ]
};