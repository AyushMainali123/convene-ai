"use client";

import { ErrorState, IErrorStateProps } from "@/components/ui/error-state"
import { LoadingState } from "@/components/ui/loading-state"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { MeetingIdViewHeader } from "../components/meeting-id-view-header";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UpdateMeetingDialog } from "../components/update-meeting-dialog";
import { useConfirm } from "@/hooks/use-confirm";
import { UpcomingState } from "../components/upcoming-state";
import { ActiveState } from "../components/active-state";
import { CancelledState } from "../components/cancelled-state";
import { ProcessingState } from "../components/processing-state";
import { CompletedState } from "../components/completed-state";

export default function MeetingIdView({ meetingid }: { meetingid: string }) {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const { data: meeting } = useSuspenseQuery(trpc.meetings.getOne.queryOptions({ id: meetingid }));

    const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false);
    const [RemoveMeetingDialog, confirmRemove] = useConfirm("Are you sure you want to delete the meeting?", "This action cannot be undone.");

    const removeMeeting = useMutation(trpc.meetings.remove.mutationOptions({
        onSuccess: async () => {
            await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
            router.replace('/meetings');
        },
        onError: (error) => {
            toast.error(error.message);
        }
    }));

    const router = useRouter();

    const handleRemove = async () => {
        const ok = await confirmRemove();
        if (!ok) return;
        await removeMeeting.mutateAsync({ id: meetingid });
    }

    return (
        <>
            <RemoveMeetingDialog />
            <UpdateMeetingDialog
                open={updateMeetingDialogOpen}
                onOpenChange={setUpdateMeetingDialogOpen}
                initialValues={meeting}
            />
            <div className="space-y-6 px-6 py-4">
                <MeetingIdViewHeader
                    meetingId={meeting.id}
                    meetingName={meeting.name}
                    onEdit={() => setUpdateMeetingDialogOpen(true)}
                    onDelete={handleRemove}
                />

                <div>
                    {meeting.status === "upcoming" && <UpcomingState meetingId={meeting.id} onCancelMeeting={() => { }} isCancelling={false} />}
                    {meeting.status === "processing" && <ProcessingState />}
                    {meeting.status === "completed" && <CompletedState data={meeting} />}
                    {meeting.status === "cancelled" && <CancelledState />}
                    {meeting.status === "active" && <ActiveState meetingId={meeting.id} />}
                </div>


            </div >
        </>
    )
}

export const MeetingIDViewLoadingState = () => {
    return (
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
            <LoadingState title="Loading Meeting" description="Please wait while we load your Meeting" />
        </div>
    )
}


export const MeetingIDViewErrorState = (props: IErrorStateProps) => {
    return (
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
            <ErrorState {...props} />
        </div>
    )
}