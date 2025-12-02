import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"


interface IDashboardCommandProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function DashboardCommand({ open, setOpen }: IDashboardCommandProps) {
    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Find meetings or agents" />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                    <CommandItem>Meetings</CommandItem>
                    <CommandItem>Agents</CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}