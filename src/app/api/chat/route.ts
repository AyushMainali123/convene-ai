import { streamText, UIMessage, convertToModelMessages, ModelMessage } from 'ai';
import { googleAIClient } from '@/lib/google-ai-provider';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { meetings } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { afterMeetingChatPrompt } from '@/lib/model-instructions';


export async function POST(req: Request) {

    const session = await auth.api.getSession({
        headers: req.headers
    })

    if (!session) return new Response("Unauthorized", { status: 401 });

    const { messages }: { messages: UIMessage[] } = await req.json();
    const meetingId = (messages[messages.length - 1].metadata as { meetingId?: string })?.meetingId;

    if (!meetingId) return new Response("Meeting ID not found", { status: 400 });

    const [meeting] = await db.select().from(meetings).where(and(
        eq(meetings.id, meetingId),
        eq(meetings.userId, session.user.id)
    )).limit(1);

    if (!meeting) return new Response("Meeting not found", { status: 404 });

    let transcriptText: string | null = null;
    try {
        const transcripts = await fetch(meeting.transcriptUrl!);
        transcriptText = await transcripts.text();
    } catch (error) {
        console.log(error);
        return new Response("Error fetching transcript", { status: 404 });
    }

    const systemInstruction: ModelMessage = {
        role: "system",
        content: afterMeetingChatPrompt({ summary: meeting.summary ?? "", transcript: transcriptText }),
    }

    const result = streamText({
        model: googleAIClient("gemini-2.5-flash"),
        messages: [systemInstruction, ...convertToModelMessages(messages)],
    });

    return result.toUIMessageStreamResponse();
}