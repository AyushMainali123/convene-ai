"use client";

import { LoadingState } from "@/components/ui/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AgentsDataTable } from "../components/data-table";
import { agentColumns } from "../components/columns";

export default function AgentsView() {
    const trpc = useTRPC();
    const { data: agents } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

    return (
        <div>
            <AgentsDataTable columns={agentColumns} data={agents} />
        </div>
    );
}


export const AgentsViewLoadingState = () => {
    return (
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
            <LoadingState title="Loading Agents" description="Please wait while we load your agents" />
        </div>
    )
}
