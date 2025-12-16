"use client";

import {
    BotIcon,
    VideoIcon,
    SettingsIcon,
    LayoutDashboardIcon,
} from "lucide-react";
import Link from "next/link";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroupLabel
} from "@/components/ui/sidebar";
import { DashboardUserButton } from "./dashboard-user-button";
import { PlanUpgradeBanner } from "./plan-upgrade-banner";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";


const mainRoutes = [
    {
        icon: LayoutDashboardIcon,
        label: "Overview",
        href: "/",
        matchExact: true,
    },
    {
        icon: VideoIcon,
        label: "Meetings",
        href: "/meetings",
    },
    {
        icon: BotIcon,
        label: "Agents",
        href: "/agents",
    }
]

const settingsRoutes = [
    {
        icon: SettingsIcon,
        label: "Settings",
        href: "/settings",
    }
]


export const DashboardSidebar = () => {

    const pathname = usePathname();
    const trpc = useTRPC();
    const { data: currentProduct } = useSuspenseQuery(trpc.premium.getCurrentSubscription.queryOptions());

    const currentPlan = (() => {
        if (!currentProduct) return "Free";
        return currentProduct.name;
    })()

    return (
        <Sidebar className="border-r-0 bg-sidebar-primary/5">
            <SidebarHeader className="pb-0">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="md:h-12 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                            <Link href="/">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                                    <BotIcon className="size-5" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-bold text-lg tracking-tight">{process.env.NEXT_PUBLIC_APPLICATION_NAME}</span>
                                    <span className="truncate text-xs text-muted-foreground">{currentPlan}</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-2 mt-4">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs text-muted-foreground/70 uppercase tracking-widest px-2 mb-2 font-semibold">
                        Platform
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-1">
                            {mainRoutes.map((item) => {
                                const isActive = item.matchExact
                                    ? pathname === item.href
                                    : pathname.startsWith(item.href);

                                return (
                                    <SidebarMenuItem key={item.label}>
                                        <SidebarMenuButton
                                            asChild
                                            tooltip={item.label}
                                            className={cn(
                                                "h-10 transition-all duration-200",
                                                isActive
                                                    ? "bg-primary/10 text-primary font-medium shadow-sm hover:bg-primary/15 hover:text-primary"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                                            )}
                                        >
                                            <Link href={item.href}>
                                                <item.icon className={cn("size-5", isActive && "text-primary")} />
                                                <span>{item.label}</span>
                                                {isActive && (
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                                                )}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className="mt-4">
                    <SidebarGroupLabel className="text-xs text-muted-foreground/70 uppercase tracking-widest px-2 mb-2 font-semibold">
                        Management
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-1">
                            {settingsRoutes.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <SidebarMenuItem key={item.label}>
                                        <SidebarMenuButton
                                            asChild
                                            tooltip={item.label}
                                            className={cn(
                                                "h-10 transition-all duration-200",
                                                isActive
                                                    ? "bg-primary/10 text-primary font-medium shadow-sm hover:bg-primary/15 hover:text-primary"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                                            )}
                                        >
                                            <Link href={item.href}>
                                                <item.icon className={cn("size-5", isActive && "text-primary")} />
                                                <span>{item.label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4 pt-0 space-y-3">
                <PlanUpgradeBanner />
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DashboardUserButton />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
