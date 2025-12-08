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

                <div className="max-w-sm lg:max-w-3xl mx-auto space-y-6">
                    <div className="rounded-2xl border border-border/70 bg-background/50 backdrop-blur-md p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="relative shrink-0">
                                <GeneratedAvatar collection="botttsNeutral" seed={agent.name} className="h-16 w-16 ring-4 ring-primary/20 ring-offset-4 ring-offset-background/50 rounded-full bg-linear-to-br from-primary/10 to-secondary/10" />
                            </div>

                            <div className="space-y-1.5 min-w-0">
                                <h1 className="text-2xl font-extrabold tracking-tight truncate text-foreground/90">{agent.name}</h1>
                                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                    <VideoIcon className="h-4 w-4 text-primary" />
                                    <span className="text-xs uppercase tracking-wider">{agent.meetingCount} {agent.meetingCount === 1 ? 'MEETING' : 'MEETINGS'}</span>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Instructions Section */}
                    <div className="space-y-3">
                        <h2 className="flex items-center gap-2 text-sm font-bold tracking-wider uppercase text-muted-foreground">
                            <ClipboardList className="h-4 w-4 text-primary" />
                            Instructions
                        </h2>

                        {/* Instruction Content Block */}
                        <div className="rounded-xl bg-card border border-border p-4 shadow-sm  hover:shadow-lg">
                            <p className="text-sm leading-relaxed text-foreground/80">{agent.instructions}</p>
                        </div>
                    </div>
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
