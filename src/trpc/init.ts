import { db } from '@/db';
import { agents, meetings } from '@/db/schema';
import { auth } from '@/lib/auth';
import { polarClient } from '@/lib/polar';
import { MAX_FREE_AGENTS, MAX_FREE_MEETINGS } from '@/modules/premium/constants';
import { Subscription } from '@polar-sh/sdk/models/components/subscription.js';
import { initTRPC, TRPCError } from '@trpc/server';
import { count, eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { cache } from 'react';
export const createTRPCContext = cache(async () => {
    /**
     * @see: https://trpc.io/docs/server/context
     */
    return { userId: 'user_123' };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
    /**
     * @see https://trpc.io/docs/server/data-transformers
     */
    // transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "You are not authenticated" })
    }

    return next({ ctx: { ...ctx, auth: session } })
});

export const premiumProcedure = (entity: 'agent' | 'meeting') => protectedProcedure.use(async ({ ctx, next }) => {
    const customer = await polarClient.customers.getStateExternal({
        externalId: ctx.auth.user.id
    });

    const hasSubscription = customer.activeSubscriptions.length > 0;

    let subscription: Subscription | null = null;

    if (hasSubscription) {
        subscription = await polarClient.subscriptions.get({
            id: customer.activeSubscriptions[0].id
        });
    }

    const agentsLimit = subscription?.metadata.maxAgents as number ?? MAX_FREE_AGENTS;
    const meetingsLimit = subscription?.metadata.maxMeetings as number ?? MAX_FREE_MEETINGS;

    const [userAgents] = await db.select({ count: count() }).from(agents).where(eq(agents.userId, ctx.auth.user.id));
    const [userMeetings] = await db.select({ count: count() }).from(meetings).where(eq(meetings.userId, ctx.auth.user.id));


    const shouldThrowAgentsError = entity === "agent" && userAgents.count >= agentsLimit;
    const shouldThrowMeetingsError = entity === "meeting" && userMeetings.count >= meetingsLimit;

    if (shouldThrowAgentsError) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You have reached the maximum number of free agents" })
    }

    if (shouldThrowMeetingsError) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You have reached the maximum number of free meetings" })
    }

    return next({ ctx: { ...ctx, customer } });
});