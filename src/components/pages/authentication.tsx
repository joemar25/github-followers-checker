"use client";

import { Metadata } from "next";
import { ModeToggle } from "../ui/mode-toggle";
import { UserAuthForm } from "../auth/user-auth-form";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Github } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Authentication",
    description: "Authentication forms built using the components.",
};

export default function AuthenticationPage() {
    return (
        <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            {/* Left Side */}
            <div className="relative hidden h-full flex-col p-10 text-white dark:border-r lg:flex">
                {/* Background with image and fallback gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-zinc-800">
                    <Image
                        src="/images/bg.jpg"
                        alt="Background Image"
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 1024px) 0vw, 50vw"
                    />
                </div>
                {/* Overlay to ensure text readability */}
                <div className="absolute inset-0 bg-black/50" />

                <div className="relative z-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Github className="h-6 w-6" />
                        <span className="text-lg font-medium">GitConnect</span>
                    </div>
                    <ModeToggle />
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-6">
                        <p className="text-xl font-medium leading-relaxed">
                            Connect with the global developer community. Build your network, share your work,
                            and discover amazing projects from developers around the world.
                        </p>
                        <footer className="flex items-center gap-4 text-sm">
                            <div className="h-12 w-12 rounded-full bg-zinc-700/50 backdrop-blur-sm flex items-center justify-center">
                                <Github className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="font-semibold">Join thousands of developers</p>
                                <p className="text-zinc-300">who are already part of our community</p>
                            </div>
                        </footer>
                    </blockquote>
                </div>
            </div>

            {/* Right Side */}
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="space-y-1">
                            <h1 className="text-2xl font-semibold tracking-tight text-center">
                                Welcome to GitConnect
                            </h1>
                            <p className="text-sm text-muted-foreground text-center">
                                Sign in with GitHub to connect with developers and manage your network
                            </p>
                        </CardHeader>
                        <CardContent>
                            <UserAuthForm />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}