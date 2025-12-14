import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { signOut, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { ChevronDown, CreditCard, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";


export const DashboardUserButton = () => {

    const { data: session } = useSession();
    const isMobile = useIsMobile();
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/auth/signin");
                }
            }
        })
    }

    if (!session) return null;

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <Button variant={"outline"} className="h-12 w-full data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex items-center gap-2">
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                            <AvatarFallback className="rounded-lg">
                                {session?.user?.name?.slice(0, 2)?.toUpperCase() || "CN"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">{session?.user?.name}</span>
                        </div>
                    </Button>

                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>{session.user.name}</DrawerTitle>
                        <DrawerDescription>{session.user.email}</DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                        <Button onClick={() => router.push("/upgrade")}>
                            <CreditCard aria-hidden="true" />
                            Billing
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleLogout}
                        >
                            <LogOut aria-hidden="true" />
                            Log out
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                    size="lg"
                    variant={"outline"}
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                    <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                        <AvatarFallback className="rounded-lg">
                            {session?.user?.name?.slice(0, 2)?.toUpperCase() || "CN"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{session?.user?.name}</span>
                    </div>
                    <ChevronDown className={cn(
                        open && "rotate-180"
                    )} aria-hidden="true" />
                </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
            >
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                            <AvatarFallback className="rounded-lg">
                                {session?.user?.name?.slice(0, 2)?.toUpperCase() || "CN"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">{session?.user?.name}</span>
                            <span className="truncate text-xs">{session?.user?.email}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/upgrade")}>
                    <CreditCard aria-hidden="true" />
                    Billing
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut aria-hidden="true" />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}