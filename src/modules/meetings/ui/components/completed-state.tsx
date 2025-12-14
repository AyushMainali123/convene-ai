"use client";

import { GeneratedAvatar } from "@/components/ui/generated-avatar";
import { TMeetingGetOne } from "../../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Markdown from "react-markdown";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import humanizeDuration from "humanize-duration";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Bot, FileText, Sparkles, Video, Calendar, Clock, ChevronRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatUI } from "./chat-ui";
import { Transcript } from "./transcript";

interface Props {
    data: TMeetingGetOne;
}

const toSecond = (ms: number) => ms * 1000;

export const CompletedState = ({ data }: Props) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
            {/* Left Column: Video and Metadata */}
            <div className="lg:col-span-2 space-y-6">
                {/* Video Player Card */}
                <Card className="overflow-hidden border border-border shadow-sm bg-card/50 backdrop-blur-sm">
                    <div className="aspect-video w-full bg-black/5 relative group">
                        {data?.recordingUrl ? (
                            <video
                                src={data.recordingUrl}
                                controls
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground gap-4">
                                <Video className="size-16 opacity-20" />
                                <p>No recording available</p>
                            </div>
                        )}
                    </div>
                    <CardHeader className="pb-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1.5">
                                <CardTitle className="text-2xl font-semibold leading-none tracking-tight">
                                    {data.name}
                                </CardTitle>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="size-3.5" />
                                    <span>{new Date(data.createdAt).toLocaleDateString(undefined, {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}</span>
                                    <Separator orientation="vertical" className="h-3" />
                                    <Clock className="size-3.5" />
                                    <span>{humanizeDuration(toSecond(data.duration), { round: true, largest: 2, units: ['h', 'm', 's'] })}</span>
                                </div>
                            </div>

                            <Link href={`/agents/${data.agentId}`}>
                                <Button variant="outline" size="sm" className="gap-2 rounded-full h-8 pl-1 pr-3">
                                    <GeneratedAvatar seed={data.agent.name} collection="botttsNeutral" className="size-6" />
                                    <span className="text-xs font-medium">{data.agent.name}</span>
                                    <ChevronRight className="size-3 text-muted-foreground ml-auto" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                </Card>
            </div>

            {/* Right Column: Insights Tabs */}
            <div className="h-full min-h-[600px]">
                <Card className="h-full flex flex-col border-border bg-card/50 backdrop-blur-sm shadow-sm">
                    <Tabs defaultValue="summary" className="flex-1 flex flex-col">
                        <div className="px-4 py-3 border-b border-border">
                            <TabsList className="w-full grid grid-cols-3">
                                <TabsTrigger value="summary" className="gap-2">
                                    <Sparkles className="size-3.5" />
                                    Summary
                                </TabsTrigger>
                                <TabsTrigger value="transcript" className="gap-2">
                                    <FileText className="size-3.5" />
                                    Transcript
                                </TabsTrigger>
                                <TabsTrigger value="chat" className="gap-2">
                                    <Bot className="size-3.5" />
                                    Ask AI
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <CardContent className="flex-1 p-0 overflow-hidden relative">
                            {/* Summary Content */}
                            <TabsContent value="summary" className="h-full m-0 data-[state=active]:flex flex-col">
                                <ScrollArea className="flex-1 h-full">
                                    <div className="p-6 prose dark:prose-invert max-w-none text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground prose-p:leading-relaxed">

                                        <Badge variant="secondary" className="gap-1 rounded-sm px-2">
                                            <Sparkles className="size-3 text-primary fill-primary/10" />
                                            <span className="text-primary font-medium">AI Generated Summary</span>
                                        </Badge>

                                        <ScrollArea className="max-h-92">
                                            <Markdown>{data.summary || "*No summary available for this meeting.*"}</Markdown>
                                        </ScrollArea>
                                    </div>
                                </ScrollArea>
                            </TabsContent>

                            {/* Transcript Content */}
                            <TabsContent value="transcript" className="h-full m-0 data-[state=active]:flex flex-col">
                                <ScrollArea className="flex-1 h-full">
                                    <Transcript meetingId={data.id} />
                                </ScrollArea>
                            </TabsContent>

                            {/* Ask AI Content */}
                            <TabsContent value="chat" className="h-full m-0 flex-col data-[state=active]:flex">
                                <ChatUI meetingId={data.id} agentName={data.agent.name} />
                            </TabsContent>
                        </CardContent>
                    </Tabs>
                </Card>
            </div>
        </div>
    )
}