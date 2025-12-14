import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { meetingsInsertSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TMeetingGetOne } from "../../types";
import { CommandSelect } from "@/components/ui/command-select";
import { useState } from "react";
import { GeneratedAvatar } from "@/components/ui/generated-avatar";
import { MAX_PAGE_SIZE } from "@/app/constants";
import { useRouter } from "next/navigation";

interface IMeetingFormProps {
    onSuccess?: (id: string) => void;
    onCancel?: () => void;
    initialValues?: TMeetingGetOne;
}


export const MeetingForm = ({ onSuccess, onCancel, initialValues }: IMeetingFormProps) => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const router = useRouter();

    const [agentSearch, setAgentSearch] = useState("");

    const { data: agents, isLoading: areAgentsLoading } = useQuery(trpc.agents.getMany.queryOptions({ pageSize: MAX_PAGE_SIZE, search: agentSearch }))

    const createMeeting = useMutation(trpc.meetings.create.mutationOptions({
        onSuccess: async (data) => {
            await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
            await queryClient.invalidateQueries(trpc.premium.getFreeUsage.queryOptions());
            onSuccess?.(data.id);
        },
        onError: (error) => {
            toast.error(error.message);
            if (error.data?.code && error.data.code === "FORBIDDEN") {
                router.push('/upgrade');
            }
        }
    }));

    const updateMeeting = useMutation(trpc.meetings.update.mutationOptions({
        onSuccess: async () => {
            await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
            if (initialValues?.id) {
                await queryClient.invalidateQueries(trpc.meetings.getOne.queryOptions({ id: initialValues.id }));
                onSuccess?.(initialValues.id);
            }
        },
        onError: (error) => {
            toast.error(error.message);
        }
    }));

    const form = useForm<z.infer<typeof meetingsInsertSchema>>({
        resolver: zodResolver(meetingsInsertSchema),
        defaultValues: {
            name: initialValues?.name ?? "",
            agentId: initialValues?.agentId ?? "",
        }
    });


    const isEdit = !!initialValues?.id;
    const isPending = createMeeting.isPending || updateMeeting.isPending;


    const onSubmit: SubmitHandler<z.infer<typeof meetingsInsertSchema>> = (data) => {
        if (isEdit) {
            updateMeeting.mutate({ id: initialValues.id, ...data });
        } else {
            createMeeting.mutate(data);
        }
    }

    const onError: SubmitErrorHandler<z.infer<typeof meetingsInsertSchema>> = (err) => {
        console.error(err)
    }

    return (
        <div className="w-full max-w-2xl mx-auto px-4 md:px-0">
            <form noValidate onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6 mx-auto pb-4">
                <Controller
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => {
                        return (
                            <Field data-invalid={fieldState.invalid} className="gap-0.5">
                                <div >
                                    <FieldLabel htmlFor="meeting-name" data-invalid={fieldState.invalid} className="mb-1">Meeting Name</FieldLabel>
                                    <Input {...field} id="meeting-name" aria-invalid={fieldState.invalid} placeholder="e.g. Enterpreneurship" />
                                </div>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )
                    }}
                />

                <Controller
                    control={form.control}
                    name="agentId"
                    render={({ field, fieldState }) => {
                        return (
                            <Field data-invalid={fieldState.invalid} className="gap-0.5">
                                <div>
                                    <FieldLabel htmlFor="agent-id" data-invalid={fieldState.invalid} className="mb-1">Agent</FieldLabel>
                                    <CommandSelect
                                        className="w-full"
                                        isLoading={areAgentsLoading}
                                        options={agents?.items?.map((agent) => ({
                                            label: agent.name,
                                            value: agent.id,
                                            children: (
                                                <div className="flex items-center gap-2">
                                                    <GeneratedAvatar seed={agent.name} collection="botttsNeutral" className="size-6" />
                                                    <span>{agent.name}</span>
                                                </div>
                                            )
                                        })) || []}
                                        onSelect={field.onChange}
                                        onSearch={setAgentSearch}
                                        value={field.value || ""}
                                        placeholder="Select an agent"
                                        isSearchable
                                    />
                                </div>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )
                    }}
                />

                <div className="flex justify-end gap-2 mt-2">
                    {onCancel && (
                        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
                            Cancel
                        </Button>
                    )}

                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Saving..." : "Save Meeting"}
                    </Button>
                </div>
            </form>
        </div>
    )
}