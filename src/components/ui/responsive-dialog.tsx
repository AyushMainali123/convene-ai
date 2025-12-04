"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "./drawer";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./dialog";

interface IResponsiveDialogProps extends React.ComponentProps<typeof DialogPrimitive.Root> {
    title: string;
    description: string;

}

export function ResponsiveDialog({ children, title, description, ...props }: IResponsiveDialogProps) {

    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <Drawer {...props}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>{title}</DrawerTitle>
                        <DrawerDescription>{description}</DrawerDescription>
                    </DrawerHeader>
                    {children}
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <Dialog {...props}>
            <DialogContent className="max-h-[calc(100vh-4rem)] h-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}