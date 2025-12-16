"use client";

import { AgentForm } from "../components/agent-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AgentNewView() {
    const router = useRouter();

    return (
        <div className="flex flex-col gap-6 p-6 lg:p-8 max-w-3xl mx-auto w-full">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild className="size-8 rounded-full shadow-none">
                    <Link href="/agents">
                        <ChevronLeft className="size-4" />
                    </Link>
                </Button>
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold tracking-tight">New Agent</h1>
                    <p className="text-sm text-muted-foreground">
                        Create a new AI agent to handle your meetings
                    </p>
                </div>
            </div>

            <Card className="shadow-md border-border/50">
                <CardHeader className="pb-4">
                    <CardTitle>Agent Details</CardTitle>
                    <CardDescription>
                        Give your agent a name and instructions on how to behave.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AgentForm
                        onSuccess={() => router.push("/agents")}
                    />
                </CardContent>
            </Card>
        </div>
    );
}