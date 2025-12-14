import UpgradeView, { UpgradeViewErrorState, UpgradeViewLoadingState } from "@/modules/premium/ui/views/upgrade-view";
import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function UpgradePage() {

    const queryClient = getQueryClient();

    await queryClient.prefetchQuery(trpc.premium.getCurrentSubscription.queryOptions());
    await queryClient.prefetchQuery(trpc.premium.getProducts.queryOptions());

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<UpgradeViewLoadingState />}>
                <ErrorBoundary FallbackComponent={UpgradeViewErrorState}>
                    <UpgradeView />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    )
}