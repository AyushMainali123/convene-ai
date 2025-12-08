import { DEFAULT_PAGE_SIZE, INITIAL_PAGE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/app/constants";
import { z } from "zod";

export const agentsInsertSchema = z.object({
    name: z.string().min(1, "Name is required"),
    instructions: z.string().min(1, "Instructions is required"),
});

export const agentsGetManySchema = z.object({
    search: z.string().nullish().default(""),
    pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
    page: z.number().default(INITIAL_PAGE),
});

export const agentsUpdateScehma = z.object({
    id: z.string().min(1, "ID is required"),
    name: z.string().min(1, "Name is required"),
    instructions: z.string().min(1, "Instructions is required"),
});