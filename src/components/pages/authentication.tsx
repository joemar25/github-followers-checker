"use client";

import Link from "next/link";
import { ModeToggle } from "../ui/mode-toggle";
import { UserAuthForm } from "../auth/user-auth-form";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Github, Flame, Ghost } from "lucide-react";
import { InteractiveThreeDBackground } from "../auth/interactive-3d-background";

export default function AuthenticationPage() {
    return (
        <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 bg-background text-foreground overflow-hidden">
            {/* Left Side: Premium Decorative Interactive Section */}
            <div className="relative hidden h-full flex-col p-10 lg:flex border-r border-border bg-muted/10 overflow-hidden">
                {/* 3D Interactive Nodes background */}
                <InteractiveThreeDBackground />

                {/* Soft glow bubbles using standard theme-based color classes */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl opacity-40 pointer-events-none animate-pulse duration-10000" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-3xl opacity-40 pointer-events-none animate-pulse duration-7000" />

                <div className="relative z-20 flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="flex items-center gap-2.5 font-bold tracking-tight">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md transition-transform hover:scale-105 duration-300">
                            <Github className="h-5 w-5" />
                        </div>
                        <span className="text-xl bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                            GitConnect
                        </span>
                    </div>
                </div>

                <div className="relative z-20 mt-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                    <div className="space-y-4 max-w-lg">
                        <h2 className="text-3xl font-extrabold tracking-tight leading-tight select-none">
                            {"Find out who unfollowed you on GitHub."}
                        </h2>
                        <p className="text-base text-muted-foreground leading-relaxed select-none">
                            {"An honest, open-source tool to inspect your following list. No corporate hype, no fake wrappers. Just see who isn't following you back, and clean up your account."}
                        </p>
                    </div>

                    {/* Features checklist with premium card-like design */}
                    <div className="grid grid-cols-2 gap-4 select-none">
                        <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:border-primary/20 hover:bg-card">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Ghost className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-medium">Ghost Finder</span>
                        </div>
                        <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:border-primary/20 hover:bg-card">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Flame className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-medium">Clean Pruning</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Authentication Panel */}
            <div className="relative flex min-h-screen items-center justify-center p-4 lg:p-8">
                {/* Subtle background glow for mobile/overall view */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-primary/5 blur-3xl opacity-80 pointer-events-none lg:hidden" />

                <div className="absolute top-6 right-6 z-20 animate-in fade-in slide-in-from-top-4 duration-700">
                    <ModeToggle />
                </div>

                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px] animate-in fade-in zoom-in-95 duration-500">
                    <Card className="border border-border/60 bg-card/85 backdrop-blur-md shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-border hover:shadow-primary/5">
                        {/* Glowing accent bar */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/10 via-primary to-primary/10" />

                        <CardHeader className="space-y-2.5 pt-8 pb-6">
                            <div className="flex lg:hidden justify-center mb-2 animate-bounce duration-3000">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
                                    <Github className="h-6 w-6" />
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-center">
                                Welcome to GitConnect
                            </h1>
                            <p className="text-sm text-muted-foreground text-center px-4">
                                Sign in with your GitHub account to analyze and sync your network
                            </p>
                        </CardHeader>
                        <CardContent className="pb-8">
                            <UserAuthForm />
                        </CardContent>
                    </Card>
                    <p className="px-8 text-center text-xs text-muted-foreground select-none">
                        {"Need help? "}
                        <Link
                            href="/docs"
                            className="underline underline-offset-4 hover:text-primary transition-colors font-medium"
                        >
                            {"View Documentation"}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}