import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";

export function IntegrationTab() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Connected Services</CardTitle>
                <CardDescription>
                    Manage connections to third-party services and tools.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center size-10 rounded-lg bg-indigo-100 text-indigo-600">
                            <Lock className="size-5" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium leading-none">Webhook</p>
                            <p className="text-sm text-muted-foreground">
                                Send meeting summaries to a custom URL.
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" disabled>Comming soon</Button>
                </div>
            </CardContent>
        </Card>
    )
}