import { db } from "@/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentsInsertSchema } from "../schemas";
import { agents } from "@/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

export const agentsRouter = createTRPCRouter({
    getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
        const [agent] = await db.select().from(agents).where(eq(agents.id, input.id));
        return agent;
    }),
    getMany: protectedProcedure.query(async ({ ctx }) => {
        const agentsData = await db.query.agents.findMany({
            where: eq(agents.userId, ctx.auth.user.id)
        });
        return agentsData;
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