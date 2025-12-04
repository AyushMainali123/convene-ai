"use client"

import { ColumnDef } from "@tanstack/react-table"
import { TAgentGetOne } from "../../types"
import { GeneratedAvatar } from "@/components/ui/generated-avatar"
import { MoreHorizontal, VideoIcon, Calendar, ArrowUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"

export const agentColumns: ColumnDef<TAgentGetOne>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-muted/50 -ml-4"
        >
          Agent
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 sm:gap-3">
          <GeneratedAvatar
            seed={row.original.name}
            collection="botttsNeutral"
            className="size-8 sm:size-10 shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <h5 className="font-semibold text-sm truncate">{row.original.name}</h5>
            <p className="text-xs text-muted-foreground hidden sm:block">ID: {row.original.id.slice(0, 8)}...</p>
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: "instructions",
    header: ({ column }) => {
      return <span className="hidden lg:inline-block">Instructions</span>
    },
    cell: ({ row }) => {
      const instructions = row.original.instructions
      const truncated = instructions.length > 60 ? `${instructions.slice(0, 60)}...` : instructions
      return (
        <div className="max-w-md hidden lg:block">
          <p className="text-sm text-muted-foreground line-clamp-2" title={instructions}>
            {truncated}
          </p>
        </div>
      )
    }
  },
  {
    accessorKey: "meetingCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-muted/50 -ml-4"
        >
          Meetings
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <Badge variant="outline" className="gap-1.5 font-medium whitespace-nowrap">
        <VideoIcon className="size-3.5 text-blue-600 dark:text-blue-400" />
        <span className="hidden sm:inline">{row.original.meetingCount} {row.original.meetingCount === 1 ? "meeting" : "meetings"}</span>
        <span className="sm:hidden">{row.original.meetingCount}</span>
      </Badge>
    )
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-muted/50 -ml-4 hidden md:flex"
        >
          Created
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.original.createdAt
      return (
        <div className="items-center gap-2 hidden md:flex">
          <Calendar className="size-3.5 text-muted-foreground" />
          <span className="text-sm">{format(new Date(date), "MMM dd, yyyy")}</span>
        </div>
      )
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const agent = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(agent.id)}
            >
              Copy agent ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit agent</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete agent</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]