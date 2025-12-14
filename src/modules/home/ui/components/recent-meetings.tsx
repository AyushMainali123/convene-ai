import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightIcon, VideoIcon, InfoIcon } from "lucide-react";
import Link from "next/link";
import { RECENT_MEETINGS_LIMIT } from "@/modules/home/constants";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { INITIAL_PAGE } from "@/app/constants";
import { format } from "date-fns";


export function RecentMeetings() {

    const trpc = useTRPC();

    const { data: meetings } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({
        pageSize: RECENT_MEETINGS_LIMIT,
        page: INITIAL_PAGE,
    }));

    const isMeetingsEmpty = meetings.items.length === 0;

    return (
        <Card className="col-span-1 md:col-span-4 shadow-sm border-sidebar-border/50 h-fit">
            <CardHeader>
                <CardTitle>Recent Meetings</CardTitle>
                <CardDescription>
                    Your latest recorded sessions and summaries.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isMeetingsEmpty ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/20 border border-dashed rounded-lg h-full">
                        <InfoIcon className="size-8 text-muted-foreground/60 mb-3" />
                        <p className="text-md font-semibold text-foreground/80">No Recent Meetings Found</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Get started by creating your first meeting summary.
                        </p>
                        <Button className="mt-4" asChild>
                            <Link href="/meetings">Create New Meeting</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {meetings.items.map((meeting) => (
                            <Link href={`/meetings/${meeting.id}`} key={meeting.id}>
                                <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center justify-center size-9 rounded-md bg-background border">
                                            <VideoIcon className="size-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium leading-none">{meeting.name}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {format(meeting.createdAt, 'MMMM d, yyyy \'at\' h:mm a')}
                                            </p>
                                        </div>
                                    </div>
                                    <ArrowRightIcon className="size-4 text-muted-foreground" />
                                </div>
                            </Link>
                        ))}
                        <Button variant="outline" className="w-full mt-2" asChild>
                            <Link href="/meetings">View All Meetings</Link>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}