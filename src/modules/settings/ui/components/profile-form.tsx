"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { updateUserNameSchema } from "../../schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";


export function ProfileForm() {
    const { data: session, isPending: isSessionLoading, error: sessionError, refetch } = authClient.useSession();
    const trpc = useTRPC();
    const { mutate: updateUserName, isPending: isUpdatingUserName } = useMutation(trpc.settings.updateUserName.mutationOptions({
        onSuccess: () => {
            refetch();
        },
        onError: (e) => {
            toast.error(e.message);
        }
    }));

    const form = useForm<z.infer<typeof updateUserNameSchema>>({
        defaultValues: {
            name: session?.user.name
        },
        resolver: zodResolver(updateUserNameSchema)
    });

    const handleSubmit = (data: z.infer<typeof updateUserNameSchema>) => {
        updateUserName({ name: data.name });
    }

    if (isSessionLoading || sessionError || !session) return null;

    return (
        <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                        Update your account profile details and preferences.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Controller name="name" control={form.control} render={({ field, fieldState }) => {
                        return (
                            <Field data-invalid={fieldState.invalid} className="gap-0.5">
                                <div className="grid gap-2">
                                    <FieldLabel htmlFor="name" data-invalid={fieldState.invalid} className="mb-1">Name</FieldLabel>
                                    <Input {...field} id="name" aria-invalid={fieldState.invalid} placeholder="Your Name" />
                                </div>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )
                    }} />
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" placeholder="email@example.com" defaultValue={session.user.email} disabled />
                        <p className="text-[0.8rem] text-muted-foreground">
                            Email addresses cannot be changed directly. Contact support for assistance.
                        </p>
                    </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button type="submit" disabled={isUpdatingUserName}>Save Changes</Button>
                </CardFooter>
            </Card>
        </form>
    )
}