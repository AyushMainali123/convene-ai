"use client";
import { ErrorState, IErrorStateProps } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function MeetingsView() {
    const trpc = useTRPC();
    const { data: meetings } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));
    return (
        <div>
            {JSON.stringify(meetings)}
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