import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardNavbar } from "@/modules/dashboard/ui/components/dashboard-navbar";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session) return redirect('/auth/signin');

    const queryClient = getQueryClient();
    queryClient.prefetchQuery(trpc.premium.getCurrentSubscription.queryOptions());

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <SidebarProvider>
                <DashboardSidebar />
                <main className="w-full">
                    <DashboardNavbar />
                    {children}
                </main>
            </SidebarProvider>
        </HydrationBoundary>

    );

}