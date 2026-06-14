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
        <div className={cn("grid gap-4", className)} {...props}>
            <Button 
                onClick={handleLogin} 
                variant="outline" 
                type="button" 
                disabled={isLoading}
                className="w-full py-5 border border-input bg-background transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:border-primary/20 active:scale-[0.98] rounded-xl font-semibold shadow-sm flex items-center justify-center gap-2.5 group"
            >
                {isLoading ? (
                    <Icons.spinner className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                    <Icons.gitHub className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                )}
                <span>Continue with GitHub</span>
            </Button>
        </div>
    );
}
