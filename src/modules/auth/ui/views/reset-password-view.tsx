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
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";

const resetPasswordFormSchema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const DEFAULT_VALUES = {
    password: "",
    confirmPassword: ""
}


export function ResetPasswordView() {

    const form = useForm<z.infer<typeof resetPasswordFormSchema>>({
        resolver: zodResolver(resetPasswordFormSchema),
        defaultValues: DEFAULT_VALUES
    });

    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // Get token from URL query params
        const tokenFromUrl = searchParams.get("token");
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            setError("Invalid or missing reset token. Please request a new password reset.");
        }
    }, [searchParams]);

    const onSubmit = async (values: z.infer<typeof resetPasswordFormSchema>) => {
        if (!token) {
            setError("Invalid or missing reset token. Please request a new password reset.");
            return;
        }

        authClient.resetPassword({
            newPassword: values.password,
            token: token,
        }, {
            onRequest: () => {
                setPending(true);
                setError(null);
            },
            onError: (ctx) => {
                setError(ctx.error?.message || "Failed to reset password");
            },
            onSuccess: () => {
                setSuccess(true);
                // Redirect to signin after 2 seconds
                setTimeout(() => {
                    router.push("/auth/signin");
                }, 2000);
            },
            onResponse: () => {
                setPending(false);
            }
        })
    };


    return (
        <form id="reset-password-form" noValidate className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Reset Password</h1>
                    <p className="text-balance text-muted-foreground">
                        Enter your new password below
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
                        <AlertTitle>Password Reset Successful!</AlertTitle>
                        <AlertDescription>
                            Your password has been reset. Redirecting to sign in...
                        </AlertDescription>
                    </Alert>
                )}
                <div className="grid gap-2">
                    <Controller
                        name="password"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="password">New Password</FieldLabel>
                                <Input
                                    {...field}
                                    id="password"
                                    type="password"
                                    placeholder="Enter your new password"
                                    aria-invalid={fieldState.invalid}
                                    disabled={!token || pending || success}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </div>
                <div className="grid gap-2">
                    <Controller
                        name="confirmPassword"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                                <Input
                                    {...field}
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm your new password"
                                    aria-invalid={fieldState.invalid}
                                    disabled={!token || pending || success}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </div>
                <Button type="submit" className="w-full" disabled={!token || pending || success}>
                    {pending ? "Resetting..." : "Reset Password"}
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