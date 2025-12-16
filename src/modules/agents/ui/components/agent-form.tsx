import { useTRPC } from "@/trpc/client";
import { TAgentGetOne } from "../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { agentsInsertSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GeneratedAvatar } from "@/components/ui/generated-avatar";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner"
import { useRouter } from "next/navigation";

interface IAgentFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialValues?: TAgentGetOne;
}

export const AgentForm = ({ onSuccess, onCancel, initialValues }: IAgentFormProps) => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const router = useRouter();

    const createAgent = useMutation(trpc.agents.create.mutationOptions({
        onSuccess: async () => {
            await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
            await queryClient.invalidateQueries(trpc.premium.getUsage.queryOptions());
            onSuccess?.();
        },
        onError: (error) => {
            toast.error(error.message);
            if (error.data?.code && error.data.code === "FORBIDDEN") {
                router.push('/upgrade');
            }
        }
    }));

    const updateAgent = useMutation(trpc.agents.update.mutationOptions({
        onSuccess: async () => {
            await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
            if (initialValues?.id) {
                await queryClient.invalidateQueries(trpc.agents.getOne.queryOptions({ id: initialValues.id }));
            }
            onSuccess?.();
        },
        onError: (error) => {
            toast.error(error.message)
        }
    }));

    const form = useForm<z.infer<typeof agentsInsertSchema>>({
        resolver: zodResolver(agentsInsertSchema),
        defaultValues: {
            name: initialValues?.name ?? "",
            instructions: initialValues?.instructions ?? ""
        }
    });


    const isEdit = !!initialValues?.id;
    const isPending = createAgent.isPending || updateAgent.isPending;


    const onSubmit = (data: z.infer<typeof agentsInsertSchema>) => {
        if (isEdit) {
            updateAgent.mutate({ id: initialValues.id, ...data });
        } else {
            createAgent.mutate(data);
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto px-4 md:px-0">
            <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mx-auto pb-4">
                <div className="flex justify-center mb-1.5 md:mb-6">
                    <GeneratedAvatar seed={form.watch("name")} collection="botttsNeutral" className="size-16 md:size-32 border-4 border-muted rounded-full" />
                </div>

                <Controller
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => {
                        return (
                            <Field data-invalid={fieldState.invalid} className="gap-0.5">
                                <div >
                                    <FieldLabel htmlFor="agent-name" data-invalid={fieldState.invalid} className="mb-1">Agent Name</FieldLabel>
                                    <Input {...field} id="agent-name" aria-invalid={fieldState.invalid} placeholder="e.g. Support Bot" />
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
                    name="instructions"
                    render={({ field, fieldState }) => {
                        return (
                            <Field data-invalid={fieldState.invalid} className="gap-0.5">
                                <div>
                                    <FieldLabel htmlFor="agent-instructions" data-invalid={fieldState.invalid} className="mb-1">Instructions</FieldLabel>
                                    <Textarea {...field} id="agent-instructions" aria-invalid={fieldState.invalid} placeholder="Describe how the agent should behave..." className="lg:min-h-[150px]" />
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
                        {isPending ? "Saving..." : "Save Agent"}
                    </Button>
                </div>
            </form>
        </div>
    )
}