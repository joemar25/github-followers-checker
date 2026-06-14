// src\components\auth\logout.tsx
'use client'

import { signOut } from "next-auth/react"
import { Button } from "../ui/button"

const Logout: React.FC = () => {
    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" })
    }

    return (
        <Button
            variant="outline"
            onClick={handleLogout}
            className="rounded-full font-medium transition-all duration-300 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive/20"
        >
            Logout
        </Button>
    )
}

export default Logout