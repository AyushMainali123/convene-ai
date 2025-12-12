import { db } from "@/db";
import { agents, meetings, user } from "@/db/schema"
import { inngest } from "@/inngest/client";
import { TMeetingStatus, TStreamTranscriptItem } from "@/modules/meetings/types";
import { eq, inArray } from "drizzle-orm";
import { createAgent, gemini, TextMessage } from "@inngest/agent-kit";
import { parseJSONL } from "@/lib/utils";

const systemPrompt = `
You are an expert summarizer. You write readable, concise, simple content. You are given a transcript of a meeting and you need to summarize it.

Use the following markdown structure for every output:

### Overview
Provide a detailed, engaging summary of the session's content. Focus on major features, user workflows, and any key takeaways. Write in a narrative style, using full sentences. Highlight unique or powerful aspects of the product, platform, or discussion.

### Notes
Break down key content into thematic sections with timestamp ranges. Each section should summarize key points, actions, or demos in bullet format.

Example:
#### Section Name
- Main point or demo shown here
- Another key insight or interaction
- Follow-up tool or explanation provided

#### Next Section
- Feature X automatically does Y
- Mention of integration with Z
`.trim();

const geminiAPIKey = process.env.GEMINI_API_KEY;

if (!geminiAPIKey) {
    throw new Error("GEMINI_API_KEY is not defined");
}

const summarizer = createAgent({
    name: "summarizer",
    system: systemPrompt,
    model: gemini({
        model: "gemini-2.5-flash",
        apiKey: geminiAPIKey
    })
});

export const meetingsProcessing = inngest.createFunction(
    { id: "meetings/processing" },
    { event: "meetings/processing" },
    async ({ event, step }) => {
        const response = await step.run("fetch-transcript", async () => {
            const urlResponse = await fetch(event.data.transcriptUrl)
            const data = await urlResponse.text();
            return data;
        });

        const transcript = await step.run("parse-transcript", async () => {
            const objects = parseJSONL<TStreamTranscriptItem>(response) as TStreamTranscriptItem[];
            return objects;
        });

        const transcriptsWithSpeakers = await step.run("add-speakers", async () => {
            const speakerIds = [...new Set<string>(...transcript.map(item => item.speaker_id))];

            const userSpeakers = await db.select().from(user).where(inArray(user.id, speakerIds));
            const agentSpeakers = await db.select().from(agents).where(inArray(agents.id, speakerIds));
            const speakers = [...userSpeakers, ...agentSpeakers];

            return transcript.map(item => {
                const speaker = speakers.find(sp => sp.id === item.speaker_id);

                if (!speaker) {
                    return { ...item, user: { name: "Unknown" } }
                }

                return { ...item, user: { name: speaker.name } }
            });
        });

        const { output } = await summarizer.run(
            `Summarize the following transcript: ${JSON.stringify(transcriptsWithSpeakers)}`
        );

        await step.run("save-summary", async () => {
            await db.update(meetings).set({
                summary: (output[0] as TextMessage).content as "string",
                status: TMeetingStatus.Completed
            }).where(eq(meetings.id, event.data.meetingId))
        })

    }
)