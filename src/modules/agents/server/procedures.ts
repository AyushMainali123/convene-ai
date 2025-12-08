import { db } from "@/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentsGetManySchema, agentsInsertSchema, agentsUpdateScehma } from "../schemas";
import { agents } from "@/db/schema";
import { z } from "zod";
import { and, count, desc, eq, getTableColumns, ilike, sql, } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const agentsRouter = createTRPCRouter({
    getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
        const [agent] = await db.select({
            meetingCount: sql<number>`5`,
            ...getTableColumns(agents)
        }).from(agents).where(and(eq(agents.id, input.id), eq(agents.userId, ctx.auth.user.id)));

        if (!agent) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" })
        }

        return agent;
    }),
    remove: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
        const { auth } = ctx;
        const [removedAgent] = await db.delete(agents).where(and(eq(agents.id, input.id), eq(agents.userId, auth.user.id))).returning();

        if (!removedAgent) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" })
        }

        return removedAgent;
    }),
    update: protectedProcedure.input(agentsUpdateScehma).mutation(async ({ ctx, input }) => {
        const { auth } = ctx;

        const [updatedAgent] = await db.update(agents).set(input).where(and(eq(agents.id, input.id), eq(agents.userId, auth.user.id))).returning();

        if (!updatedAgent) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" })
        }

        return updatedAgent;
    }),
    getMany: protectedProcedure.input(agentsGetManySchema).query(async ({ ctx, input }) => {

        const agentsData = await db.select({
            meetingCount: sql<number>`5`,
            ...getTableColumns(agents)
        }).from(agents).where(and(
            eq(agents.userId, ctx.auth.user.id),
            ilike(agents.name, `%${input.search}%`)
        )).limit(input.pageSize)
            .offset((input.page - 1) * input.pageSize)
            .orderBy(desc(agents.createdAt), desc(agents.id));


        const [result] = await db.select({ count: count() }).from(agents).where(and(
            eq(agents.userId, ctx.auth.user.id),
            ilike(agents.name, `%${input.search}%`)
        ));

        const totalPages = Math.ceil(result.count / input.pageSize);


        return { items: agentsData, count: result.count, totalPages };
    }),
    create: protectedProcedure.input(agentsInsertSchema).mutation(async ({ ctx, input }) => {
        const { name, instructions } = input;
        const { auth } = ctx;
        const [createdAgent] = await db.insert(agents).values({
            name,
            instructions,
            userId: auth.user.id
        }).returning();

        return createdAgent;
    })
})