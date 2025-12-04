import { ErrorState } from "@/components/ui/error-state";
import AgentsView, { AgentsViewLoadingState } from "@/modules/agents/ui/views/agents-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { AgentsListHeader } from "@/modules/agents/ui/components/agents-list-header";

export default async function AgentsPage() {
    const queryClient = getQueryClient();

    await queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());

    return (
        <>
            <AgentsListHeader />
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<AgentsViewLoadingState />}>
                    <ErrorBoundary FallbackComponent={ErrorState}>
                        <AgentsView />
                    </ErrorBoundary>
                </Suspense>
            </HydrationBoundary >
        </>
    )
}