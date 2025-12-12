"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Copy, Check, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Helper function to format seconds into MM:SS
function formatTimestamp(ms: number): string {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);

    // Format as HH:MM:SS,mmm (SRT style)
    return (
        hours > 0 ? String(hours).padStart(2, "0") + ":" : "" +
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0")
    );
}

export const Transcript = ({ meetingId }: { meetingId: string }) => {
    const trpc = useTRPC();
    const { data: transcript, isLoading: isTranscriptLoading } = useQuery(trpc.meetings.getTranscript.queryOptions({ id: meetingId }));
    const [searchQuery, setSearchQuery] = useState("");
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const filteredTranscript = transcript?.filter((item) => {
        const query = searchQuery.toLowerCase();
        return (
            item.text.toLowerCase().includes(query) ||
            item.user.name?.toLowerCase().includes(query)
        );
    });

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        toast.success("Transcript copied to clipboard");
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    if (isTranscriptLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-10 h-full text-muted-foreground gap-2">
                <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm">Loading transcript...</p>
            </div>
        );
    }

    if (!transcript || transcript.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-10 h-full text-muted-foreground">
                <p>No transcript available for this meeting.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header / Search */}
            <div className="sticky top-0 bg-card/95 backdrop-blur z-20 px-6 py-4 border-b space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Full Transcript ({transcript.length} entries)
                    </span>
                </div>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Search transcript..."
                        className="pl-9 bg-background/50"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Transcript List */}
            <div className="flex-1 p-6 space-y-8">
                {filteredTranscript?.length === 0 ? (
                    <div className="text-center text-muted-foreground py-10">
                        <p>No matches found for "{searchQuery}"</p>
                    </div>
                ) : (
                    filteredTranscript?.map((tr, index) => (
                        <div key={`${tr.start_ts}-${index}`} className="flex gap-4 group">
                            {/* Avatar */}
                            <div className="shrink-0 mt-1">
                                <Avatar className="size-8 border">
                                    <AvatarImage src={tr.user.image || undefined} alt={tr.user.name || "Speaker"} />
                                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                        {tr.user.name ? tr.user.name.substring(0, 2).toUpperCase() : <User className="size-3" />}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            {/* Content */}
                            <div className="flex-1 space-y-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-foreground">
                                            {tr.user.name || "Unknown Speaker"}
                                        </span>
                                        <span className="text-xs text-muted-foreground font-mono">
                                            {formatTimestamp(tr.start_ts)}
                                        </span>
                                    </div>

                                    {/* Copy Button (Visible on Hover) */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={cn(
                                            "size-6 opacity-0 group-hover:opacity-100 transition-opacity",
                                            copiedIndex === index && "opacity-100 text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                                        )}
                                        onClick={() => handleCopy(tr.text, index)}
                                        title="Copy text"
                                    >
                                        {copiedIndex === index ? <Check className="size-3" /> : <Copy className="size-3" />}
                                    </Button>
                                </div>
                                <p className="text-sm text-foreground/80 leading-relaxed text-pretty">
                                    {tr.text}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}