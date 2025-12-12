import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { inngest } from "@/inngest/client";
import { getMeetingInstruction } from "@/lib/model-instructions";
import { streamClient } from "@/lib/stream-video";
import { TMeetingStatus } from "@/modules/meetings/types";
import { WebhookEvent } from "@stream-io/node-sdk";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type TCustomData = {
    meetingId?: string;
    meetingName?: string;
}

export const POST = async (req: Request) => {
    const signature = req.headers.get("x-signature");
    const apiKey = req.headers.get("x-api-key");
    const openAiApiKey = process.env.OPENAI_API_KEY;

    if (!signature || !apiKey) return NextResponse.json({ error: "Missing signature or API key" }, { status: 400 })
    if (!openAiApiKey) return NextResponse.json({ error: "Missing openAI API key" }, { status: 400 })

    const data = await req.text();
    const isValid = streamClient.verifyWebhook(data, signature);

    if (!isValid) return NextResponse.json({ error: "Invalid signature" }, { status: 400 });

    let webhookData: WebhookEvent | null;
    try {
        webhookData = JSON.parse(data) as WebhookEvent;
    } catch (error) {
        return NextResponse.json({ error: "Failed to parse webhook data" }, { status: 400 })
    }

    const eventType = webhookData.type;
    if (eventType === "call.session_started") {
        const customData = webhookData.call.custom as TCustomData;

        if (!customData.meetingId) {
            return NextResponse.json({ error: "Missing meetingId" }, { status: 400 })
        }

        const [existingMeeting] = await db.update(meetings)
            .set({ status: TMeetingStatus.Active, startedAt: new Date() })
            .where(and(
                eq(meetings.id, customData.meetingId),
                eq(meetings.status, TMeetingStatus.Upcoming)
            ))
            .returning();

        if (!existingMeeting) {
            const [activeMeeting] = await db.select().from(meetings).where(eq(meetings.id, customData.meetingId));

            if (activeMeeting?.status === TMeetingStatus.Active) {
                return NextResponse.json({ ok: true }, { status: 200 });
            }

            return NextResponse.json({ error: "Meeting not found or not upcoming" }, { status: 400 });
        }

        const [existingAgent] = await db.select().from(agents).where(eq(agents.id, existingMeeting.agentId));

        if (!existingAgent) {
            return NextResponse.json({ error: "Agent not found" }, { status: 400 })
        }


        try {

            const call = streamClient.video.call("default", customData.meetingId);
            const realtimeClient = await streamClient.video.connectOpenAi({
                call,
                openAiApiKey,
                agentUserId: existingAgent.id
            });

            realtimeClient.updateSession({
                instructions: getMeetingInstruction({
                    agentName: existingAgent.name,
                    agentInstruction: existingAgent.instructions,
                    meetingName: existingMeeting.name
                }),
                modalities: ["text", "audio"],
                turn_detection: { type: "server_vad" },
            });
        } catch (error) {
            return NextResponse.json({ error: "Failed to initialize AI session" }, { status: 500 });
        }

    } else if (eventType === "call.session_participant_left") {
        const meetingId = webhookData.call_cid.split(":")[1]; // meetingId is the second part of the call_cid

        if (!meetingId) {
            return NextResponse.json({ error: "Missing meetingId" }, { status: 400 })
        }

        try {
            const call = streamClient.video.call("default", meetingId);
            await call.end();

        } catch (error) {
            return NextResponse.json({ error: "Failed to end call" }, { status: 500 });
        }
    } else if (eventType === "call.session_ended") {
        const customData = webhookData.call.custom as TCustomData;
        const meetingId = customData.meetingId;

        if (!meetingId) {
            return NextResponse.json({ error: "Missing meetingId" }, { status: 400 })
        }

        try {
            await db.update(meetings)
                .set({ status: TMeetingStatus.Processing, endedAt: new Date() })
                .where(and(eq(meetings.id, meetingId), eq(meetings.status, TMeetingStatus.Active)));

        } catch (error) {
            return NextResponse.json({ error: "Failed to update meeting status" }, { status: 500 });
        }
    } else if (eventType === "call.transcription_ready") {
        const meetingId = webhookData.call_cid.split(":")[1]; // meetingId is the second part of the call_cid

        try {
            const [updatedMeeting] = await db.update(meetings)
                .set({ transcriptUrl: webhookData.call_transcription.url })
                .where(eq(meetings.id, meetingId)).returning();

            if (!updatedMeeting) {
                return NextResponse.json({ error: "Meeting not found" }, { status: 400 });
            }

        } catch (error) {
            return NextResponse.json({ error: "Failed to update meeting transcript URL" }, { status: 500 });
        }

        await inngest.send({
            name: "meetings/processing",
            data: {
                meetingId,
                transcriptUrl: webhookData.call_transcription.url
            }
        });
    } else if (eventType === "call.recording_ready") {
        const meetingId = webhookData.call_cid.split(":")[1]; // meetingId is the second part of the call_cid

        try {
            const [updatedMeeting] = await db.update(meetings)
                .set({ recordingUrl: webhookData.call_recording.url })
                .where(eq(meetings.id, meetingId)).returning();

            if (!updatedMeeting) {
                return NextResponse.json({ error: "Meeting not found" }, { status: 400 });
            }

        } catch (error) {
            return NextResponse.json({ error: "Failed to update meeting recording URL" }, { status: 500 });
        }
    }


    return NextResponse.json({ ok: true }, { status: 200 })
}