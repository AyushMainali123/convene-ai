'use client';

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { NewAgentDialog } from "./new-agent-dialog";
import { useState } from "react";

export function AgentsListHeader() {
    const [open, setOpen] = useState(false);
    return (
        <>
            <NewAgentDialog open={open} onOpenChange={setOpen} />
            <div className="flex items-center justify-between py-4 px-6 gap-y-4">
                <h5 className="font-medium text-xl">My Agents</h5>
                <Button onClick={() => setOpen(true)}>
                    <PlusIcon aria-hidden="true" />
                    New Agent
                </Button>
            </div>
        </>
    )
}