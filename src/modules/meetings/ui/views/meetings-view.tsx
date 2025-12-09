"use client";
import { DataTable } from "@/components/ui/data-table";
import { ErrorState, IErrorStateProps } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { meetingColumns } from "../components/columns";
import { useRouter } from "next/navigation";
import { DataPagination } from "@/components/ui/data-pagination";
import { useMeetingsFilter } from "../../hooks/use-meetings-filter";

export default function MeetingsView() {
    const router = useRouter();
    const trpc = useTRPC();

    const [filter, setFilter] = useMeetingsFilter();
    const { data: meetings } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({
        ...filter
    }));
    return (
        <div className="px-6 py-4">
            <DataTable
                columns={meetingColumns}
                data={meetings.items}
                onRowClick={(row) => router.push(`/meetings/${row.id}`)}
                emptyState={{
                    title: "Create your first meeting",
                    description: "No meetings yet. Create one with AI and see how effortless collaboration can be."
                }}
            />

            <DataPagination
                page={filter.page}
                totalPages={meetings.totalPages}
                onPageChange={(page) => setFilter({ ...filter, page })}
            />
        </div>
    )
}


export const MeetingsViewLoadingState = () => {
    return (
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
            <LoadingState title="Loading Meetings" description="Please wait while we load your Meetings" />
        </div>
    )
}


export const MeetingsViewErrorState = (props: IErrorStateProps) => {
    return (
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
            <ErrorState {...props} />
        </div>
    )
}