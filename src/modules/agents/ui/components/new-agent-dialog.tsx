"use client";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { AgentForm } from "./agent-form";

interface INewAgentDialog {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}


export function NewAgentDialog({ open, onOpenChange }: INewAgentDialog) {
    return (
        <ResponsiveDialog open={open} onOpenChange={onOpenChange} title="New Agent" description="Create a new agent">
            <AgentForm onCancel={() => onOpenChange(false)} onSuccess={() => onOpenChange(false)} />
        </ResponsiveDialog>
    )
}