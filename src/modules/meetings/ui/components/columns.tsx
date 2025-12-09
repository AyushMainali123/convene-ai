import { ColumnDef } from "@tanstack/react-table";
import { TMeetingGetMany } from "../../types";
import humanizeDuration from "humanize-duration";
import { CircleCheckIcon, CircleXIcon, ClockArrowUpIcon, LoaderIcon, TimerIcon } from "lucide-react";
import { GeneratedAvatar } from "@/components/ui/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function formatDuration(duration: number) {
    return humanizeDuration(duration * 1000, { round: true });
}

const statusIconMap = {
    upcoming: ClockArrowUpIcon,
    active: LoaderIcon,
    completed: CircleCheckIcon,
    processing: LoaderIcon,
    cancelled: CircleXIcon
}

const statusColorMap = {
    upcoming: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    active: "bg-green-500/10 text-green-500 border-green-500/20 animate-pulse",
    completed: "bg-primary/10 text-primary border-primary/20",
    processing: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20"
}

export const meetingColumns: ColumnDef<TMeetingGetMany[number]>[] = [
    {
        accessorKey: "name",
        header: "Meeting Details",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col gap-3">
                    <p className="font-semibold text-lg leading-none tracking-tight">
                        {row.original.name}
                    </p>
                    <div className="flex items-center gap-2">
                        <GeneratedAvatar
                            seed={row.original.agent.name}
                            collection="botttsNeutral"
                            className="h-6 w-6 border border-border/50"
                        />
                        <span className="text-sm text-muted-foreground font-medium">
                            {row.original.agent.name}
                        </span>
                    </div>
                </div>
            )
        }
    },
    {
        id: "meta",
        header: "Status & Duration",
        cell: ({ row }) => {
            const Icon = statusIconMap[row.original.status];

            return (
                <div className="flex flex-col items-end gap-2.5">
                    <Badge
                        variant="outline"
                        className={cn(
                            "gap-1.5 whitespace-nowrap px-3 py-1",
                            statusColorMap[row.original.status]
                        )}
                    >
                        <Icon className="h-3.5 w-3.5" />
                        <span className="text-sm font-medium capitalize">
                            {row.original.status}
                        </span>
                    </Badge>

                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/30 px-2 py-1 rounded-md border border-border/20">
                        <TimerIcon className="h-3.5 w-3.5 opacity-70" />
                        <span>
                            {row.original.duration ? formatDuration(row.original.duration) : "N/A"}
                        </span>
                    </div>
                </div>
            )
        }
    }
]