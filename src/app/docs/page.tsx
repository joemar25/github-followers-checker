"use client";

import Link from "next/link";
import { useState } from "react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { ChevronLeft, BookOpen, Terminal, Shield, HelpCircle, Network, Users } from "lucide-react";

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState("getting-started");

    const sections = [
        { id: "getting-started", label: "Getting Started" },
        { id: "ghost-finder", label: "Ghost Finder" },
        { id: "clean-pruning", label: "Clean Pruning" },
        { id: "canvas-engine", label: "3D Glitch Canvas" },
        { id: "faq", label: "FAQ & Troubleshooting" },
    ];

    const scrollToSection = (id: string) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="rounded-full gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                            <ChevronLeft className="h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>
                    <div className="h-4 w-[1px] bg-border/50" />
                    <div className="flex items-center gap-2 font-bold text-sm">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span>GitConnect Docs</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <ModeToggle />
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row px-6 py-8 gap-8">
                {/* Sidebar Navigation */}
                <aside className="md:w-64 shrink-0 flex flex-col gap-1.5 md:sticky md:top-24 h-fit border-b md:border-b-0 md:border-r border-border/40 pb-6 md:pb-0 pr-0 md:pr-6">
                    <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase px-2 mb-2">Table of Contents</span>
                    {sections.map((sec) => (
                        <button
                            key={sec.id}
                            onClick={() => scrollToSection(sec.id)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                activeSection === sec.id
                                    ? "bg-primary text-primary-foreground shadow-sm scale-[1.02]"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            }`}
                        >
                            {sec.label}
                        </button>
                    ))}
                </aside>

                {/* Documentation Body */}
                <main className="flex-1 space-y-12 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                    
                    {/* Getting Started */}
                    <section id="getting-started" className="space-y-4 scroll-mt-24">
                        <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <BookOpen className="h-4.5 w-4.5" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight border-b border-border/30 pb-2">Getting Started</h2>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                            {"Welcome to GitConnect. This application is designed to help you analyze, audit, and clean up your GitHub connections. By connecting your GitHub account, you can quickly find out who is not following you back and prune your following list."}
                        </p>
                        <div className="bg-muted/30 border border-border/40 rounded-2xl p-5 space-y-3">
                            <h3 className="text-sm font-bold flex items-center gap-2">
                                <Terminal className="h-4 w-4 text-primary" />
                                Connection Flow
                            </h3>
                            <ol className="list-decimal list-inside text-xs text-muted-foreground space-y-2 leading-relaxed">
                                <li>{"Click Continue with GitHub on the home screen."}</li>
                                <li>{"Authorize the GitConnect application on GitHub (requires read:user and user:follow OAuth scopes)."}</li>
                                <li>{"Once authorized, you will be redirected to the secure dashboard to view your network data."}</li>
                            </ol>
                        </div>
                    </section>

                    {/* Ghost Finder */}
                    <section id="ghost-finder" className="space-y-4 scroll-mt-24">
                        <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Users className="h-4.5 w-4.5" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight border-b border-border/30 pb-2">Ghost Finder</h2>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                            {"A Ghost Connection (or one-way follow) occurs when you follow a developer, but they do not follow you back. This section displays a paginated list of all accounts you follow that haven't returned the connection."}
                        </p>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                            {"We query both lists in real time using secure, rate-limit optimized pages, cache the results for 60 seconds to respect GitHub API boundaries, and perform a cross-reference join in memory."}
                        </p>
                    </section>

                    {/* Clean Pruning */}
                    <section id="clean-pruning" className="space-y-4 scroll-mt-24">
                        <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Network className="h-4.5 w-4.5" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight border-b border-border/30 pb-2">Clean Pruning</h2>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                            {"Pruning helps keep your social feed clean and focused on developers you interact with."}
                        </p>
                        <div className="bg-muted/30 border border-border/40 rounded-2xl p-5 space-y-3">
                            <h3 className="text-sm font-bold flex items-center gap-2">
                                <Shield className="h-4 w-4 text-primary" />
                                How to Unfollow Ghosts
                            </h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {"Navigate to the Not Following Back card in your dashboard. Click the Unfollow button next to any username. This fires a secure DELETE call to the GitHub follow API on your behalf. The UI will animate, showing an active loader, and notify you of success via a toast alert."}
                            </p>
                        </div>
                    </section>

                    {/* 3D Glitch Canvas */}
                    <section id="canvas-engine" className="space-y-4 scroll-mt-24">
                        <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Terminal className="h-4.5 w-4.5" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight border-b border-border/30 pb-2">3D Glitch Canvas</h2>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                            {"The visual background on the login screen is a custom 3D particle nodes network built using HTML5 Canvas and vanilla Javascript. It features:"}
                        </p>
                        <ul className="list-disc list-inside text-xs text-muted-foreground space-y-2 leading-relaxed pl-2">
                            <li><strong>{"Inertia-based Mouse Tracking"}</strong>: {"The 3D coordinates rotate based on cursor position. Leaving the panel triggers a slow, default orbital drift."}</li>
                            <li><strong>{"Dynamic HSL parsing"}</strong>: {"Uses MutationObservers to match the system theme color variables, serving dark lines in Light Mode and light lines in Dark Mode automatically."}</li>
                            <li><strong>{"Scanline Glitches"}</strong>: {"Flickers the pixel nodes occasionally to create an industrial, studio cyberpunk aesthetic (inspired by Linkin Park album visuals)."}</li>
                        </ul>
                    </section>

                    {/* FAQ */}
                    <section id="faq" className="space-y-4 scroll-mt-24">
                        <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <HelpCircle className="h-4.5 w-4.5" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight border-b border-border/30 pb-2">FAQ & Troubleshooting</h2>
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <h4 className="text-sm font-semibold">{"Is my GitHub token safe?"}</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {"Yes. Your Access Token is stored securely inside the session cookies encrypted by NextAuth and is only passed directly to the GitHub API over secure HTTPS connections. We never save your token to any external database."}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-semibold">{"Why are some avatars slow to load?"}</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {"Avatars are served directly from the GitHub content delivery network. During periods of high traffic, upstream image responses may occasionally lag."}
                                </p>
                            </div>
                        </div>
                    </section>

                </main>
            </div>
        </div>
    );
}
