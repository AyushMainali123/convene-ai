"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { BotIcon, SparklesIcon, VideoIcon } from "lucide-react";

export function StatsGrid() {
    const trpc = useTRPC();
    const { data: meetingsCount } = useSuspenseQuery(trpc.meetings.getMeetingsCount.queryOptions());
    const { data: agentsCount } = useQuery(trpc.agents.getAgentsCount.queryOptions());
    const { data: currentSubscription } = useQuery(trpc.premium.getCurrentSubscription.queryOptions());

    const currentPlan = currentSubscription?.name || "Free";

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-sm border-sidebar-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">
                        Total Meetings
                    </CardTitle>
                    <VideoIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{meetingsCount.totalMeetings}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        +{meetingsCount.meetingsOfThisWeek} meetings this week
                    </p>
                </CardContent>
            </Card>
            <Card className="shadow-sm border-sidebar-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">
                        Active Agents
                    </CardTitle>
                    <BotIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{agentsCount?.agentsCount}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        All agents operational
                    </p>
                </CardContent>
            </Card>
            <Card className="shadow-sm bg-primary/5 border-primary/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium text-primary">
                        Plan Status
                    </CardTitle>
                    <SparklesIcon className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-primary">{currentPlan}</div>
                    <p className="text-xs text-primary/80 mt-1">
                        {currentPlan === "Free" ? "Upgrade for more limits" : "Unlimited meetings and agents"}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}