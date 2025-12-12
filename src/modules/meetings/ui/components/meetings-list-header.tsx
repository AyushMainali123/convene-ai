'use client';

import { Button } from "@/components/ui/button";
import { PlusIcon, RotateCw, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NewMeetingDialog } from "./new-meeting-dialog";
import { MeetingSearchFilter } from "./meeting-search-filter";
import { StatusFilter } from "./status-filter";
import { AgentIdFilter } from "./agent-id-filter";
import { useMeetingsFilter } from "../../hooks/use-meetings-filter";
import { useTRPC } from "@/trpc/client";
import { useQueryClient } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const REFETCH_INTERVAL = 60000;

export function MeetingsListHeader() {
    const [open, setOpen] = useState(false);
    const [filters, setFilters] = useMeetingsFilter();
    const [isRefetching, setRefetching] = useState(false);
    const intervalID = useRef<number | null>(null);

    const isMeetingFiltersModified = filters.agentId || filters.status || filters.search;

    function clearFilters() {
        setFilters({ agentId: null, page: null, search: null, status: null });
    }

    const trpc = useTRPC();
    const queryClient = useQueryClient();

    async function refetchMeetings() {
        setRefetching(true);
        try {
            await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({ ...filters }));
        } catch (error) {
            console.error(error);
        } finally {
            setRefetching(false);
        }
    }

    useEffect(() => {
        intervalID.current = window.setInterval(refetchMeetings, REFETCH_INTERVAL);
        return () => {
            if (intervalID.current) {
                window.clearInterval(intervalID.current);
                intervalID.current = null;
            }
        };
    }, [filters]);


    return (
        <>
            <NewMeetingDialog open={open} onOpenChange={setOpen} />
            <div className="flex flex-col gap-6 py-8 px-4 sm:px-6 lg:px-8">
                {/* Visual Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">
                            Meetings
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Manage and review your AI agent meetings.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={isRefetching}
                            onClick={refetchMeetings}
                            title="Refresh meetings"
                            className="h-10 w-10 shrink-0"
                        >
                            <RotateCw className={cn("h-4 w-4", isRefetching && "animate-spin")} />
                            <span className="sr-only">Refresh</span>
                        </Button>
                        <Button
                            onClick={() => setOpen(true)}
                            size="default"
                            className="h-10 px-4 min-w-[140px] shadow-xs"
                        >
                            <PlusIcon className="mr-2 h-4 w-4" />
                            New Meeting
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    {/* Filters Toolbar */}
                    <div className="flex flex-col sm:flex-row gap-3 p-1">
                        <div className="flex-1 min-w-0 max-w-sm">
                            <MeetingSearchFilter />
                        </div>
                        <div className="flex flex-1 items-center gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
                            <Separator orientation="vertical" className="h-8 hidden sm:block" />
                            <StatusFilter />
                            <AgentIdFilter />

                            {isMeetingFiltersModified && (
                                <>
                                    <Separator orientation="vertical" className="h-8 hidden sm:block" />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearFilters}
                                        className="h-10 px-3 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                                    >
                                        <XIcon className="mr-2 h-4 w-4" />
                                        Clear
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
