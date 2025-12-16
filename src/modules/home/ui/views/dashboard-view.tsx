"use client";

import { ErrorState, IErrorStateProps } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { StatsGrid } from "@/modules/home/ui/components/stats-grid";
import { RecentMeetings } from "../components/recent-meetings";
import { QuickAction } from "../components/quick-action";
import { DidYouKnow } from "../components/did-you-know";

export default function DashboardView() {
    return (
        <div className="flex flex-col gap-8 p-6 md:p-8 max-w-7xl mx-auto w-full">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Overview of your workspace AI and Meetings.
                    </p>
                </div>
            </div>

            <StatsGrid />

            <div className="grid gap-6 md:grid-cols-7">

                <RecentMeetings />

                <div className="col-span-1 md:col-span-3 flex flex-col gap-6">
                    <QuickAction />
                    <DidYouKnow />
                </div>
            </div>
        </div>
    );
}


export const DashboardViewLoadingState = () => {
    return (
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
            <LoadingState title="Loading Dashboard" description="Please wait while we load your Dashboard" />
        </div>
    )
}


export const DashboardViewErrorState = (props: IErrorStateProps) => {
    return (
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
            <ErrorState {...props} />
        </div>
    )
}