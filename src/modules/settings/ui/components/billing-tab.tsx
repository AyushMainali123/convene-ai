import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

export function Billing() {

    const trpc = useTRPC();
    const { data: currentSubscription } = useQuery(trpc.premium.getCurrentSubscription.queryOptions());
    const { data: usage, isLoading: isUsageLoading } = useQuery(trpc.premium.getUsage.queryOptions());

    const subscription = useMemo(() => {
        if (!currentSubscription) return "Free";
        return currentSubscription?.name;
    }, [currentSubscription]);

    const isEnterpriseSubscription = currentSubscription && currentSubscription.name === "Enterprise";

    return (
        <>
            <Card className="border-sidebar-primary/20 bg-sidebar-primary/5">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl">{subscription} Plan</CardTitle>
                            <CardDescription>You are currently on the {subscription} plan.</CardDescription>
                        </div>

                        {currentSubscription && (
                            <Badge variant="secondary" className="bg-primary/10 text-primary text-sm px-3 py-1">
                                Active
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">Total Agents</span>
                            {(isUsageLoading || !usage) ? (
                                <Skeleton className="w-16 h-4" />
                            ) : (
                                <span className="font-mono text-xs font-semibold bg-muted px-2 py-0.5 rounded-full text-foreground/80">
                                    {usage.agentsCount} / {usage.maxAgents}
                                </span>
                            )}
                        </div>
                        <div className="h-2 w-full rounded-full bg-secondary">
                            <Progress value={usage && (usage.agentsCount / usage.maxAgents) * 100} />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">Meetings Processed</span>
                            {(isUsageLoading || !usage) ? (
                                <Skeleton className="w-16 h-4" />
                            ) : (
                                <span className="font-mono text-xs font-semibold bg-muted px-2 py-0.5 rounded-full text-foreground/80">
                                    {usage.meetingsCount} / {usage.maxMeetings}
                                </span>
                            )}
                        </div>
                        <div className="h-2 w-full rounded-full bg-secondary">
                            <Progress value={usage && (usage.meetingsCount / usage.maxMeetings) * 100} />
                        </div>
                    </div>
                </CardContent>

                {
                    !isEnterpriseSubscription && (
                        <CardFooter className="border-t border-sidebar-primary/10 px-6 py-4 flex justify-end items-center">
                            <Button className="font-semibold" asChild>
                                <Link href="/upgrade">
                                    <Zap className="mr-2 h-4 w-4" />
                                    Upgrade
                                </Link>
                            </Button>
                        </CardFooter>
                    )
                }
            </Card>
        </>
    )
}