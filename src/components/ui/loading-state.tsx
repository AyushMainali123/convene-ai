import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "./card";

interface ILoadingStateProps {
    title: string;
    description: string;
}

export function LoadingState({ title, description }: ILoadingStateProps) {
    return (
        <Card className="w-fit">
            <CardContent className="flex flex-col items-center justify-center text-center">
                <Spinner className="mb-2 size-8 text-primary" />
                <h3 className="text-lg font-medium text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm">{description}</p>
            </CardContent>
        </Card>
    );
}