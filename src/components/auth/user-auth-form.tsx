// src/components/auth/user-auth-form.tsx
"use client";

import { githubLogin } from "@/lib/actions";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Icons } from "../ui/icons";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            await githubLogin();
        } catch (error) {
            console.error("Error during GitHub login", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <Button onClick={handleLogin} variant="outline" type="button" disabled={isLoading}>
                {isLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Icons.gitHub className="mr-2 h-4 w-4" />
                )}
                GitHub
            </Button>
        </div>
    );
}
