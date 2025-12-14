"use client";

import { MeetingForm } from "../components/meeting-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MeetingsNewView() {
    const router = useRouter();

    return (
        <div className="flex flex-col gap-6 p-6 lg:p-8 max-w-3xl mx-auto w-full">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild className="size-8 rounded-full shadow-none">
                    <Link href="/meetings">
                        <ChevronLeft className="size-4" />
                    </Link>
                </Button>
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold tracking-tight">New Meeting</h1>
                    <p className="text-sm text-muted-foreground">
                        Schedule a new meeting or create a room for later
                    </p>
                </div>
            </div>

            <Card className="shadow-md border-border/50">
                <CardHeader className="pb-4">
                    <CardTitle>Meeting Details</CardTitle>
                    <CardDescription>
                        Configure your meeting settings and assign an agent.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <MeetingForm
                        onSuccess={(id) => router.push(`/meetings/${id}`)}
                    />
                </CardContent>
            </Card>
        </div>
    );
}