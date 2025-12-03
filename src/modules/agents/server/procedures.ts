import { db } from "@/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCClientError } from "@trpc/client";

export const agentsRouter = createTRPCRouter({
    getMany: baseProcedure.query(async () => {
        const agents = await db.query.agents.findMany();
        return agents;
    })
})