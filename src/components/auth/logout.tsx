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
            onClick={handleLogout}
        >
            Logout
        </Button>
    )
}

export default Logout