import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, Loader2, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { GeneratedAvatar } from "@/components/ui/generated-avatar";

interface IChatUIProps {
    meetingId: string;
    agentName: string;
}

export function ChatUI({ meetingId, agentName }: IChatUIProps) {
    const [input, setInput] = useState('');
    const { messages, sendMessage, status } = useChat({
        onError: (e) => {
            toast.error(e.message);
        },
    });

    const isProcessing = status === 'submitted' || status === 'streaming';
    const formRef = useRef<HTMLFormElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isProcessing]);


    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (input.trim() === '') return;
        sendMessage({ text: input, metadata: { meetingId } });
        setInput('');
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            formRef.current?.requestSubmit();
        }
    }

    return (
        <div className="flex flex-col h-full bg-muted/5">
            <ScrollArea className="flex-1 p-4 max-h-96" >
                <div className="flex flex-col gap-6 min-h-[300px] py-4">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center flex-1 h-full min-h-[400px] text-center text-muted-foreground gap-3 opacity-60">
                            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                <Bot className="size-8 text-primary" />
                            </div>
                            <h3 className="font-medium text-foreground">Ask anything about this meeting</h3>
                            <p className="text-sm max-w-[240px]">This AI assistant can answer questions based on the meeting transcript.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex gap-3 max-w-[90%] ${message.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'
                                        }`}
                                >
                                    {/* Avatar */}
                                    <div className="shrink-0 mt-0.5">
                                        {message.role === 'user' ? (
                                            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                                <User className="size-4 text-primary" />
                                            </div>
                                        ) : (
                                            <GeneratedAvatar seed={agentName} collection="botttsNeutral" className="size-8 border border-border" />
                                        )}
                                    </div>

                                    {/* Message Bubble */}
                                    <div className={`space-y-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                                        <div className="text-xs text-muted-foreground font-medium ml-1 mr-1">
                                            {message.role === 'user' ? 'You' : 'AI Assistant'}
                                        </div>
                                        <div
                                            className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm ${message.role === 'user'
                                                ? 'bg-primary text-primary-foreground rounded-tr-none'
                                                : 'bg-card border border-border text-card-foreground rounded-tl-none'
                                                }`}
                                        >
                                            <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-ul:my-2 prose-li:my-0.5">
                                                <ReactMarkdown>
                                                    {(message as any).content || (message as any).parts?.map((part: any) => part.type === 'text' ? part.text : '').join('')}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isProcessing && status !== 'streaming' && (
                                <div className="flex gap-3 max-w-[90%] self-start">
                                    <GeneratedAvatar seed={agentName} collection="botttsNeutral" className="size-8 border border-border" />
                                    <div className="bg-card border border-border rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
                                        <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">Thinking...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={scrollRef} />
                        </div>
                    )}
                </div>
            </ScrollArea >

            {/* Input Area */}
            < div className="p-4 bg-card border-t border-border" >
                <form ref={formRef} onSubmit={handleFormSubmit} className="relative">
                    <Input
                        placeholder="Ask a question about the meeting..."
                        className="pr-12 min-h-[48px] bg-background/50 border-input focus-visible:ring-primary/20 rounded-xl resize-none py-3 shadow-none"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isProcessing}
                    />
                    <Button
                        disabled={isProcessing || !input.trim()}
                        type="submit"
                        size="icon"
                        className="absolute right-1.5 top-1.5 size-9 rounded-lg transition-all"
                    >
                        {isProcessing ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <Send className="size-4" />
                        )}
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
                <div className="text-center mt-2">
                    <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1.5">
                        <Sparkles className="size-2.5 text-primary" />
                        AI generated responses can be inaccurate.
                    </p>
                </div>
            </div >
        </div >
    )
}