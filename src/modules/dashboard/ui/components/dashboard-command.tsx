"use client";

import { INITIAL_PAGE, MAX_PAGE_SIZE } from "@/app/constants";
import {
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    ResponsiveCommandDialog,
} from "@/components/ui/command"
import { GeneratedAvatar } from "@/components/ui/generated-avatar";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Bot, Calendar, ChevronRight, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";


interface IDashboardCommandProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function DashboardCommand({ open, setOpen }: IDashboardCommandProps) {
    const router = useRouter();
    const [input, setInput] = useState("");

    const trpc = useTRPC();
    const { data: agents, isLoading: isAgentsLoading } = useQuery(trpc.agents.getMany.queryOptions({
        page: INITIAL_PAGE,
        pageSize: MAX_PAGE_SIZE,
        search: input
    }));


    const { data: meetings, isLoading: isMeetingsLoading } = useQuery(trpc.meetings.getMany.queryOptions({
        page: INITIAL_PAGE,
        pageSize: MAX_PAGE_SIZE,
        search: input
    }))

    function handleOpenChange(open: boolean) {
        setOpen(open);
        setInput("");
    }

    const handleSelect = (path: string) => {
        router.push(path);
        setOpen(false);
    }

    return (
        <ResponsiveCommandDialog
            shouldFilter={false}
            open={open}
            onOpenChange={handleOpenChange}
            title="Search"
            description="Find meetings or agents..."
        >
            <CommandInput
                placeholder="Type to search..."
                value={input}
                onValueChange={setInput}
                className="text-base"
            />
            <CommandList className="max-h-[400px] p-2">
                <CommandGroup heading="Agents" className="text-muted-foreground/70 font-medium">
                    {
                        isAgentsLoading ? (
                            <CommandItem disabled className="py-4 justify-center text-muted-foreground">
                                <Loader2Icon className="size-4 animate-spin mr-2" />
                                <span>Searching agents...</span>
                            </CommandItem>
                        ) : (
                            agents?.items.map((agent) => (
                                <CommandItem
                                    key={agent.id}
                                    value={agent.name + agent.id}
                                    onSelect={() => handleSelect(`/agents/${agent.id}`)}
                                    className="group flex items-center justify-between rounded-lg px-3 py-2 cursor-pointer transition-colors"
                                >
                                    <div className="flex items-center gap-3">

                                        <GeneratedAvatar collection="botttsNeutral" seed={agent.name} className="size-8 border shadow-sm" />
                                        <span className="font-medium text-foreground transition-colors">{agent.name}</span>
                                    </div>
                                    <ChevronRight className="size-4 text-muted-foreground/50 transition-colors" />
                                </CommandItem>
                            )))}
                    {!isAgentsLoading && agents?.items.length === 0 && (
                        <div className="py-4 text-center text-xs text-muted-foreground/50">No agents found</div>
                    )}
                </CommandGroup>

                <CommandGroup heading="Meetings" className="mt-2 text-muted-foreground/70 font-medium">
                    {
                        isMeetingsLoading ? (
                            <CommandItem disabled className="py-4 justify-center text-muted-foreground">
                                <Loader2Icon className="size-4 animate-spin mr-2" />
                                <span>Searching meetings...</span>
                            </CommandItem>
                        ) : (
                            meetings?.items.map((meeting) => (
                                <CommandItem
                                    key={meeting.id}
                                    value={meeting.name + meeting.id}
                                    onSelect={() => handleSelect(`/meetings/${meeting.id}`)}
                                    className="group flex items-center justify-between rounded-lg px-3 py-2 cursor-pointer transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-8 items-center justify-center rounded-full bg-muted/50 border shadow-sm">
                                            <Calendar className="size-4 text-muted-foreground" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-foreground transition-colors leading-none">{meeting.name}</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="size-4 text-muted-foreground/50 transition-colors" />
                                </CommandItem>
                            )))}
                    {!isMeetingsLoading && meetings?.items.length === 0 && (
                        <div className="py-4 text-center text-xs text-muted-foreground/50">No meetings found</div>
                    )}
                </CommandGroup>
            </CommandList>
        </ResponsiveCommandDialog>
    )
}