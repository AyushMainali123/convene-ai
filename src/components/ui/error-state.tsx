'use client' // Error boundaries must be Client Components
import { AlertCircleIcon } from "lucide-react";
import { Card, CardContent } from "./card";
import { useEffect } from 'react'
import { Button } from "./button";


interface IErrorStateProps {
    error: Error & { digest?: string }
    resetErrorBoundary: () => void
}

export function ErrorState({ error, resetErrorBoundary }: IErrorStateProps) {

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <Card className="w-fit  border border-destructive">
            <CardContent className="flex flex-col items-center justify-center text-center">
                <AlertCircleIcon className="mb-2 size-8 text-destructive" />
                <h3 className="text-lg font-medium text-destructive">{error.name}</h3>
                <p className="mt-2 text-sm text-destructive max-w-sm">{error.message}</p>
                <Button onClick={resetErrorBoundary} variant={"outline"} className="mt-2">Retry</Button>
            </CardContent>
        </Card>
    );
}
