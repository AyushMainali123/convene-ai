import type { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

type TAgentOutputs = inferRouterOutputs<AppRouter>["agents"];
export type TAgentGetOne = TAgentOutputs["getOne"];