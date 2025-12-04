"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { SearchIcon } from "lucide-react"
import { useEffect, useEffectEvent, useState } from "react"
import { DashboardCommand } from "./dashboard-command"

export function DashboardNavbar() {
    const [open, setOpen] = useState(false);

    const handleKeydown = useEffectEvent((e: KeyboardEvent) => {
        if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
            setOpen(true);
        }
    })

    useEffect(() => {
        document.addEventListener("keydown", handleKeydown);
        return () => {
            document.removeEventListener("keydown", handleKeydown);
        }
    }, []);


    return (
        <>
            <nav className="flex items-center h-[65px] px-4 border-b w-full gap-4">
                <div className="flex items-center gap-2">
                    <SidebarTrigger />
                </div>
                <div className="flex-1 flex">
                    <Button
                        variant="outline"
                        className="w-full items-center gap-0 max-w-sm justify-start text-muted-foreground relative"
                        onClick={() => setOpen(true)}
                    >
                        <SearchIcon className="mr-2 h-4 w-4" />
                        Search...
                        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </Button>
                </div>
            </nav>
            <DashboardCommand open={open} setOpen={setOpen} />
        </>
    )
}