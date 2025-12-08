import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { JSX, useState } from "react";



export const useConfirm = (title: string, description: string): [() => JSX.Element, () => Promise<unknown>] => {
    const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null);

    const confirm = () => {
        return new Promise<boolean>((resolve) => {
            setPromise({ resolve });
        });
    }

    const handleClose = () => {
        setPromise(null);
    }

    const handleConfirm = () => {
        promise?.resolve(true);
        handleClose();
    }

    const handleCancel = () => {
        promise?.resolve(false);
        handleClose();
    }

    const ConfirmationDialog = () => (
        <ResponsiveDialog
            title={title}
            description={description}
            open={promise !== null}
            onOpenChange={handleClose}
        >
            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleConfirm}>Confirm</Button>
            </div>
        </ResponsiveDialog>
    );

    return [ConfirmationDialog, confirm];
}