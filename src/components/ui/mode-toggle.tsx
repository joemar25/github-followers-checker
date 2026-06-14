"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ModeToggle() {
    const { setTheme, theme } = useTheme();

    return (
        <TooltipProvider disableHoverableContent>
            <Tooltip delayDuration={50}>
                <TooltipTrigger asChild>
                    <Button
                        className="rounded-full w-9 h-9 bg-background border border-input transition-all duration-300 hover:bg-accent hover:text-accent-foreground"
                        variant="outline"
                        size="icon"
                        id="switch"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                        <SunIcon className="w-[1.2rem] h-[1.2rem] rotate-90 scale-0 transition-transform ease-in-out duration-300 dark:rotate-0 dark:scale-100" />
                        <MoonIcon className="absolute w-[1.2rem] h-[1.2rem] rotate-0 scale-100 transition-transform ease-in-out duration-300 dark:-rotate-90 dark:scale-0" />
                        <span className="sr-only">Switch Theme</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">Switch Theme</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}