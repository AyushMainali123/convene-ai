import { db } from "@/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agents, meetings } from "@/db/schema";
import { z } from "zod";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { meetingsGetManySchema, meetingsInsertSchema, meetingsUpdateSchema } from "../schemas";

export const meetingsRouter = createTRPCRouter({
    getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
        const [meeting] = await db.select({
            ...getTableColumns(meetings),
            agent: agents,
            duration: sql`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration")
        }).from(meetings)
            .innerJoin(agents, eq(meetings.agentId, agents.id))
            .where(and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id)));

        if (!meeting) {
            throw new TRPCError({ code: "NOT_FOUND", message: "meeting not found" })
        }

        return meeting;
    }),
    getMany: protectedProcedure.input(meetingsGetManySchema).query(async ({ ctx, input }) => {

        const meetingsData = await db.select({
            ...getTableColumns(meetings),
            agent: agents,
            duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration")
        }).from(meetings)
            .innerJoin(agents, eq(meetings.agentId, agents.id))
            .where(and(
                eq(meetings.userId, ctx.auth.user.id),
                ilike(meetings.name, `%${input.search}%`)
            ))
            .limit(input.pageSize)
            .offset((input.page - 1) * input.pageSize)
            .orderBy(desc(meetings.createdAt), desc(meetings.id));


        const [result] = await db.select({ count: count() }).from(meetings)
            .innerJoin(agents, eq(meetings.agentId, agents.id))
            .where(and(
                eq(meetings.userId, ctx.auth.user.id),
                ilike(meetings.name, `%${input.search}%`)
            ));

        const totalPages = Math.ceil(result.count / input.pageSize);


        return { items: meetingsData, count: result.count, totalPages };
    }),
    create: protectedProcedure.input(meetingsInsertSchema).mutation(async ({ ctx, input }) => {
        const [meeting] = await db.insert(meetings).values({
            ...input,
            userId: ctx.auth.user.id
        }).returning();

        return meeting;
    }),
    update: protectedProcedure.input(meetingsUpdateSchema).mutation(async ({ ctx, input }) => {
        const [meeting] = await db.update(meetings)
            .set(input)
            .where(and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id)))
            .returning();

        if (!meeting) {
            throw new TRPCError({ code: "NOT_FOUND", message: "meeting not found" })
        }

        return meeting;
    })
})