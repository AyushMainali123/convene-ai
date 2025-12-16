"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { TriangleAlert, CheckCircle2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { z } from "zod";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

const forgotPasswordFormSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

const DEFAULT_VALUES = {
    email: ""
}


export function ForgotPasswordView() {

    const form = useForm<z.infer<typeof forgotPasswordFormSchema>>({
        resolver: zodResolver(forgotPasswordFormSchema),
        defaultValues: DEFAULT_VALUES
    });

    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const onSubmit = async (values: z.infer<typeof forgotPasswordFormSchema>) => {

        authClient.requestPasswordReset({
            email: values.email,
            redirectTo: "/auth/reset-password"
        }, {
            onRequest: () => {
                setPending(true);
                setError(null);
            },
            onError: (ctx) => {
                setError(ctx.error?.message || "Failed to send reset email");
            },
            onSuccess: () => {
                setSuccess(true);
            },
            onResponse: () => {
                setPending(false);
            }
        })
    };


    return (
        <form id="forgot-password-form" noValidate className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Forgot Password?</h1>
                    <p className="text-balance text-muted-foreground">
                        No worries! Enter your email and we&apos;ll send you reset instructions
                    </p>
                </div>
                {error && (
                    <Alert variant="destructive">
                        <TriangleAlert />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {success && (
                    <Alert className="border-green-500 text-green-700 dark:text-green-400">
                        <CheckCircle2 className="text-green-500" />
                        <AlertTitle>Email Sent!</AlertTitle>
                        <AlertDescription>
                            We&apos;ve sent password reset instructions to your email. Please check your inbox.
                        </AlertDescription>
                    </Alert>
                )}
                <div className="grid gap-2">
                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    {...field}
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </div>
                <Button type="submit" className="w-full" disabled={pending || success}>
                    {pending ? "Sending..." : "Send Reset Instructions"}
                </Button>
                <div className="text-center text-sm">
                    Remember your password?{" "}
                    <Link href="/auth/signin" className="underline underline-offset-4">
                        Sign in
                    </Link>
                </div>
            </div>
        </form>
    )
}