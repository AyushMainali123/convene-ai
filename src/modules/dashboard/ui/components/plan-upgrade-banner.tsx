"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const PlanUpgradeBanner = () => {
    const trpc = useTRPC();
    const { data: currentProduct } = useSuspenseQuery(trpc.premium.getCurrentSubscription.queryOptions());

    const currentPlan = (() => {
        if (!currentProduct) return "Free";
        return currentProduct.name;
    })();

    const isFree = currentPlan === "Free";
    const isStandard = currentPlan === "Standard";
    const isPremium = currentPlan === "Premium";
    const isEnterprise = currentPlan === "Enterprise";

    if (isEnterprise) return null;

    let upgradeText = "See what's next for your team.";

    if (isFree) {
        // Free -> Standard
        upgradeText = "Upgrade to Standard for higher limits on meetings and agents.";
    } else if (isStandard) {
        // Standard -> Premium
        upgradeText = "Go Premium to unlock more meetings, and agents.";
    } else if (isPremium) {
        // Premium -> Enterprise
        upgradeText = "Unlock Enterprise features for teams with no limits, and dedicated support.";
    }

    return (
        <div className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-primary/10 to-primary/5 
                          group-hover:from-primary/30 group-hover:via-primary/15 group-hover:to-primary/10 
                          transition-all duration-500" />
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
            />

            <div className="relative p-3 border rounded-lg backdrop-blur-sm">
                <div className="flex items-start gap-2.5">
                    <div className={cn(
                        "size-9 rounded-md flex items-center justify-center shrink-0",
                        "bg-linear-to-br from-primary to-primary/80 shadow-lg shadow-primary/20",
                        "group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-300"
                    )}>
                        <Sparkles className="size-4 text-primary-foreground" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                        <div>
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/80">
                                    Current Plan
                                </span>
                            </div>
                            <p className="text-sm font-bold text-foreground leading-tight">
                                {currentPlan}
                            </p>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                            {upgradeText}
                        </p>

                        <Button
                            asChild
                            size="sm"
                            className={cn(
                                "w-full h-8 text-xs font-semibold shadow-sm",
                                "bg-primary hover:bg-primary/90",
                                "group-hover:shadow-md group-hover:scale-[1.02]",
                                "transition-all duration-200"
                            )}
                        >
                            <Link href="/dashboard/upgrade" className="flex items-center justify-center gap-1.5">
                                <span>Upgrade</span>
                                <ArrowUpRight className="size-3.5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};