import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { updateUserNameSchema } from "../schemas";

export const settingsRouter = createTRPCRouter({
    updateUserName: protectedProcedure.input(updateUserNameSchema).mutation(async ({ ctx, input }) => {

        const response = await auth.api.updateUser({
            headers: await headers(),
            body: {
                name: input.name,
            }
        })

        return response;
    })
});