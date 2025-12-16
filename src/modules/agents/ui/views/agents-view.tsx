"use client";

import { LoadingState } from "@/components/ui/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { agentColumns } from "../components/columns";
import { useAgentsFilter } from "../../hooks/use-agents-filter";
import { useRouter } from "next/navigation";
import { ErrorState, IErrorStateProps } from "@/components/ui/error-state";
import { DataTable } from "@/components/ui/data-table";
import { DataPagination } from "@/components/ui/data-pagination";

export default function AgentsView() {
    const trpc = useTRPC();
    const [filter, setFilter] = useAgentsFilter();
    const router = useRouter();

    const { data: agents } = useSuspenseQuery(trpc.agents.getMany.queryOptions({
        ...filter
    }));

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-4">
            <DataTable
                emptyState={{
                    title: "Create your first agent",
                    description: "Build your workforce of intelligent AI agents to automate your tasks."
                }}
                columns={agentColumns} data={agents.items} onRowClick={(data) => router.push(`/agents/${data.id}`)} />
            <div className="mt-4">
                <DataPagination
                    page={filter.page}
                    totalPages={agents.totalPages}
                    onPageChange={(page) => setFilter({ ...filter, page })}
                />
            </div>
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


export const AgentsViewErrorState = (props: IErrorStateProps) => {
    return (
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
            <ErrorState {...props} />
        </div>
    )
}
