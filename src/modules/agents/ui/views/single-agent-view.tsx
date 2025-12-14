"use client";

import { ErrorState, IErrorStateProps } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { AgentIdViewHeader } from "../components/agent-id-view-header";
import { GeneratedAvatar } from "@/components/ui/generated-avatar";
import { ClipboardList, VideoIcon } from "lucide-react";
import { useAgentsFilter } from "../../hooks/use-agents-filter";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { useState } from "react";
import { UpdateAgentDialog } from "../components/update-agent-dialog";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface ISingleAgentViewProps {
    agentId: string;
}

export default function SingleAgentView({ agentId }: ISingleAgentViewProps) {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const router = useRouter();
    const [agentsFilter] = useAgentsFilter();

    const [updateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false);

    const { data: agent } = useSuspenseQuery(trpc.agents.getOne.queryOptions({ id: agentId }));

    const removeAgentMutation = useMutation(trpc.agents.remove.mutationOptions({
        onSuccess: async () => {
            await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({ ...agentsFilter }));
            await queryClient.invalidateQueries(trpc.premium.getFreeUsage.queryOptions());
            router.replace('/agents');
        },
        onError: (error) => {
            toast.error(error.message);
        }
    }));


    const [RemoveConfirmationDialog, confirmRemove] = useConfirm(
        "Are you sure?",
        `The following action will remove ${agent.meetingCount} associated meetings`
    );

    const handleRemove = async () => {
        const ok = await confirmRemove();
        if (!ok) return;

        await removeAgentMutation.mutateAsync({ id: agentId });
    }

    return (
        <>
            <RemoveConfirmationDialog />
            <UpdateAgentDialog
                open={updateAgentDialogOpen}
                onOpenChange={setUpdateAgentDialogOpen}
                initialValues={agent}
            />
            <div className="space-y-6 px-6 py-4">
                <AgentIdViewHeader
                    agentId={agent.id}
                    agentName={agent.name}
                    onEdit={() => setUpdateAgentDialogOpen(true)}
                    onDelete={handleRemove}
                />

                <div className="max-w-xl mx-auto">
                    <Card className="shadow-md">
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                            <GeneratedAvatar collection="botttsNeutral" seed={agent.name} className="h-16 w-16 bg-muted/50 border-2 border-border" />
                            <div className="flex flex-col gap-1">
                                <CardTitle className="text-2xl font-bold">{agent.name}</CardTitle>
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <VideoIcon className="h-3.5 w-3.5" />
                                    <span className="font-medium">{agent.meetingCount} {agent.meetingCount === 1 ? 'Meeting' : 'Meetings'}</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                                    <ClipboardList className="h-4 w-4" />
                                    Instructions
                                </div>
                                <div className="rounded-lg bg-muted/40 p-4 text-sm leading-relaxed text-foreground border border-border/50">
                                    {agent.instructions}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}



export const SingleAgentViewLoadingState = () => {
    return (
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
            <LoadingState title="Loading Agent" description="Please wait while we load your agent" />
        </div>
    )
}


export const SingleAgentViewErrorState = (props: IErrorStateProps) => {
    return (
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
            <ErrorState {...props} />
        </div>
    )
}
