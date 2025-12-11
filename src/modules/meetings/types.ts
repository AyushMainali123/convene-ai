import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

type TRouterOutputs = inferRouterOutputs<AppRouter>;
export type TMeetingGetOne = TRouterOutputs['meetings']['getOne'];
export type TMeetingGetMany = TRouterOutputs['meetings']['getMany']['items'];

export enum TMeetingStatus {
    Upcoming = "upcoming",
    Active = "active",
    Completed = "completed",
    Processing = "processing",
    Cancelled = "cancelled"
}

export type TStreamTranscriptItem = {
    speaker_id: string,
    type: "speech",
    text: string,
    start_ts: number,
    stop_ts: number
}