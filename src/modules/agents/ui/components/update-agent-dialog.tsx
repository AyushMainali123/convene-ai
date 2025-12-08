import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { AgentForm } from "./agent-form";
import { TAgentGetOne } from "../../types";

interface IUpdateAgentDialog {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialValues: TAgentGetOne;
}


export function UpdateAgentDialog({ open, onOpenChange, initialValues }: IUpdateAgentDialog) {
    return (
        <ResponsiveDialog open={open} onOpenChange={onOpenChange} title="Update Agent" description="Update an existing agent">
            <AgentForm onCancel={() => onOpenChange(false)} onSuccess={() => onOpenChange(false)} initialValues={initialValues} />
        </ResponsiveDialog>
    )
}