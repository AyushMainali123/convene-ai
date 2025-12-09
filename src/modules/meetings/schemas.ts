import { DEFAULT_PAGE_SIZE, INITIAL_PAGE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/app/constants";
import { z } from "zod";

export const meetingsGetManySchema = z.object({
    search: z.string().nullish().default(""),
    pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
    page: z.number().default(INITIAL_PAGE),
});