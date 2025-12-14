import { TMeetingStatus } from "../../types";
import { useMeetingsFilter } from "../../hooks/use-meetings-filter";
import { CommandSelect } from "@/components/ui/command-select";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { GeneratedAvatar } from "@/components/ui/generated-avatar";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { MAX_PAGE_SIZE } from "@/app/constants";

const DEBOUNCE_DELAY = 500;
export const AgentIdFilter = () => {
    const [filters, setFilters] = useMeetingsFilter();
    const [agentsSearch, setAgentSearch] = useState("");
    const trpc = useTRPC();

    const debouncedSearch = useDebounce({ value: agentsSearch, delay: DEBOUNCE_DELAY });
    const { data: agents, isLoading: areAgentsLoading } = useQuery(trpc.agents.getMany.queryOptions({
        pageSize: MAX_PAGE_SIZE,
        search: debouncedSearch,
    }))

    const options = agents?.items?.map((agent) => ({
        label: agent.name,
        value: agent.id,
        children: (
            <div className="flex items-center gap-2.5">
                <GeneratedAvatar seed={agent.name} collection="botttsNeutral" className="size-5 shrink-0" />
                <span className="truncate">{agent.name}</span>
            </div>
        )
    })) ?? [];

    const selectedFilter = options.find((option) => option.value === filters.agentId) ?? null;


    return (
        <CommandSelect
            options={options}
            value={selectedFilter?.value ?? ""}
            onSelect={(value) => setFilters({ ...filters, agentId: value as TMeetingStatus })}
            isLoading={areAgentsLoading}
            isSearchable={true}
            onSearch={setAgentSearch}
            placeholder="Filter by agent"
            className="w-full sm:w-auto sm:min-w-[180px]"
        />
    )
}