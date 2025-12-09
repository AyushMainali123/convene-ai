import { db } from "@/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { meetings } from "@/db/schema";
import { z } from "zod";
import { and, count, desc, eq, getTableColumns, ilike } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { meetingsGetManySchema } from "../schemas";

export const meetingsRouter = createTRPCRouter({
    getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
        const [meeting] = await db.select({
            ...getTableColumns(meetings)
        }).from(meetings).where(and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id)));

        if (!meeting) {
            throw new TRPCError({ code: "NOT_FOUND", message: "meeting not found" })
        }

        return meeting;
    }),
    getMany: protectedProcedure.input(meetingsGetManySchema).query(async ({ ctx, input }) => {

        const meetingsData = await db.select({
            ...getTableColumns(meetings)
        }).from(meetings).where(and(
            eq(meetings.userId, ctx.auth.user.id),
            ilike(meetings.name, `%${input.search}%`)
        )).limit(input.pageSize)
            .offset((input.page - 1) * input.pageSize)
            .orderBy(desc(meetings.createdAt), desc(meetings.id));


        const [result] = await db.select({ count: count() }).from(meetings).where(and(
            eq(meetings.userId, ctx.auth.user.id),
            ilike(meetings.name, `%${input.search}%`)
        ));

        const totalPages = Math.ceil(result.count / input.pageSize);


        return { items: meetingsData, count: result.count, totalPages };
    })
})