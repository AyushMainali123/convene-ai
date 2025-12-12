"use client";

import { GeneratedAvatar } from "@/components/ui/generated-avatar";
import { TMeetingGetOne } from "../../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Markdown from "react-markdown";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import humanizeDuration from "humanize-duration";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Bot, FileText, Sparkles, Video, Calendar, Clock, ChevronRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Transcript } from "./transcript";
import { ms } from "date-fns/locale";

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
                                        <div className="flex items-center gap-2 mb-4">
                                            <Badge variant="secondary" className="gap-1 rounded-sm px-2 py-0.5">
                                                <Sparkles className="size-3 text-primary fill-primary/10" />
                                                <span className="text-primary font-medium">AI Generated Summary</span>
                                            </Badge>
                                        </div>
                                        <Markdown>{data.summary || "*No summary available for this meeting.*"}</Markdown>
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
                                <ScrollArea className="flex-1 p-4">
                                    <div className="flex flex-col gap-4 h-full justify-end min-h-[300px] text-center text-muted-foreground text-sm p-4">
                                        <div className="flex flex-col items-center gap-2 opacity-60">
                                            <Bot className="size-10" />
                                            <p>Ask anything about this meeting...</p>
                                        </div>
                                    </div>
                                </ScrollArea>
                                <div className="p-4 border-t bg-muted/20">
                                    <div className="relative">
                                        <Input
                                            placeholder="Ask a question..."
                                            className="pr-10 bg-background/50 border-muted-foreground/20 focus-visible:ring-primary/20"
                                        />
                                        <Button size="icon" variant="ghost" className="absolute right-1 top-1 size-7 text-primary hover:bg-primary/10 hover:text-primary">
                                            <Send className="size-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </TabsContent>
                        </CardContent>
                    </Tabs>
                </Card>
            </div>
        </div>
    )
}