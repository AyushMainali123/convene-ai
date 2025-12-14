'use client';

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { NewAgentDialog } from "./new-agent-dialog";
import { useState } from "react";
import { AgentSearchFilter } from "./agent-search-filter";

export function AgentsListHeader() {
    const [open, setOpen] = useState(false);
    return (
        <>
            <NewAgentDialog open={open} onOpenChange={setOpen} />
            <div className="flex flex-col gap-6 py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">
                            Agents
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Manage and customize your AI agents.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => setOpen(true)}
                            size="default"
                            className="h-10 px-4 min-w-[140px] shadow-xs"
                        >
                            <PlusIcon className="mr-2 h-4 w-4" />
                            New Agent
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row gap-3 p-1">
                        <div className="flex-1 min-w-0 max-w-sm">
                            <AgentSearchFilter />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}