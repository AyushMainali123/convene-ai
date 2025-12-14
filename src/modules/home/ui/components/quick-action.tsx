import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BotIcon, VideoIcon, ActivityIcon } from "lucide-react";
import Link from "next/link";

export function QuickAction() {
    return (<Card className="shadow-sm border-sidebar-border/50">
        <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
                Common tasks and shortcuts.
            </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
            <Button variant="secondary" className="justify-start h-10" asChild>
                <Link href="/agents/new">
                    <BotIcon className="mr-2 size-4" />
                    Create new agent
                </Link>
            </Button>
            <Button variant="secondary" className="justify-start h-10" asChild>
                <Link href="/meetings/new">
                    <VideoIcon className="mr-2 size-4" />
                    Start new session
                </Link>
            </Button>
            <Button variant="secondary" className="justify-start h-10" asChild>
                <Link href="/settings">
                    <ActivityIcon className="mr-2 size-4" />
                    Check Usage
                </Link>
            </Button>
        </CardContent>
    </Card>

    )
}