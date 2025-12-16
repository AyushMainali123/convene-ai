"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MAX_FREE_AGENTS, MAX_FREE_MEETINGS } from "@/modules/premium/constants";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export const DashboardTrial = () => {
    const trpc = useTRPC();
    const { data } = useQuery(trpc.premium.getUsage.queryOptions());

    if (!data) return null;

    const agentsPercentage = (data.agentsCount / data.maxAgents) * 100;
    const meetingsPercentage = (data.meetingsCount / data.maxMeetings) * 100;

    return (
        <Card className="w-full shadow-sm border-border ring-1 ring-primary/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full pointer-events-none" />
            <CardHeader>
                <div className="flex items-center gap-3 mb-1">
                    <div className="p-2 rounded-md bg-primary/10">
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-base font-bold tracking-tight text-foreground">
                            Free Trial Usage
                        </CardTitle>
                        <CardDescription className="text-sm mt-0.5">
                            Monitor your usage limits
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-muted-foreground">Agents Created</span>
                        <span className="font-mono text-xs font-semibold bg-muted px-2 py-0.5 rounded-full text-foreground/80">
                            {data.agentsCount} / {MAX_FREE_AGENTS}
                        </span>
                    </div>
                    <Progress value={agentsPercentage} className="h-2 bg-muted/50 [&>div]:bg-primary" />
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-muted-foreground">Meetings Processed</span>
                        <span className="font-mono text-xs font-semibold bg-muted px-2 py-0.5 rounded-full text-foreground/80">
                            {data.meetingsCount} / {MAX_FREE_MEETINGS}
                        </span>
                    </div>
                    <Progress value={meetingsPercentage} className="h-2 bg-muted/50 [&>div]:bg-primary" />
                </div>
            </CardContent>
            <CardFooter className="pt-2">
                <Button asChild className="w-full font-semibold shadow-sm" size="lg">
                    <Link href="/upgrade" className="flex items-center gap-2">
                        Upgrade Plan
                        <ArrowUpRight className="w-4 h-4 opacity-50" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}