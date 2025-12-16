import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { polarClient } from "@/lib/polar";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { count, eq } from "drizzle-orm";
import { MAX_FREE_AGENTS, MAX_FREE_MEETINGS } from "../constants";

export const premiumRouter = createTRPCRouter({
    getUsage: protectedProcedure.query(async ({ ctx }) => {
        const customer = await polarClient.customers.getStateExternal({
            externalId: ctx.auth.user.id
        });

        const subscription = customer.activeSubscriptions[0];

        const [userMeetings] = await db.select({ count: count() }).from(meetings).where(eq(meetings.userId, ctx.auth.user.id));
        const [userAgents] = await db.select({ count: count() }).from(agents).where(eq(agents.userId, ctx.auth.user.id));

        let maxAgents = MAX_FREE_AGENTS;
        let maxMeetings = MAX_FREE_MEETINGS;

        if (subscription) {
            const subscriptionData = await polarClient.products.get({
                id: subscription.productId
            });

            console.log(subscriptionData.metadata);
            maxAgents = subscriptionData.metadata.maxAgents as number || MAX_FREE_AGENTS;
            maxMeetings = subscriptionData.metadata.maxMeetings as number || MAX_FREE_MEETINGS;
        }

        return {
            meetingsCount: userMeetings.count,
            agentsCount: userAgents.count,
            maxAgents: maxAgents,
            maxMeetings: maxMeetings,
        }
    }),
    getCurrentSubscription: protectedProcedure.query(async ({ ctx }) => {
        const customer = await polarClient.customers.getStateExternal({
            externalId: ctx.auth.user.id
        });

        const subscription = customer.activeSubscriptions[0];

        if (!subscription) return null;

        const product = await polarClient.products.get({
            id: subscription.productId
        })

        return product;
    }),
    getProducts: protectedProcedure.query(async ({ ctx }) => {

        const products = await polarClient.products.list({
            isArchived: false,
            isRecurring: true,
            sorting: ["-price_amount"]
        })

        return products.result.items;
    })
})