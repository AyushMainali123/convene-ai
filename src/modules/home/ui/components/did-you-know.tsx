import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export function DidYouKnow() {
    return (
        <Card className="bg-linear-to-br from-primary/5 via-primary/0 to-transparent border-primary/10">
            <CardHeader>
                <CardTitle className="text-lg">Did you know?</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    You can customize your agent's personality and knowledge base.
                </p>
                <Button variant="link" className="has-[>svg]:px-0  px-0 mt-2 h-auto text-primary" asChild>
                    <Link href="/agents">
                        Customize Agents <ArrowRightIcon className="size-3" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    )
}