"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { z } from "zod";
import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import SocialLogins from "../social-logins/social-logins";

const signinFormSchema = z.object({
    email: z.email(),
    password: z.string().min(1, "Password is required"),
});

const DEFAULT_VALUES = {
    email: "",
    password: ""
}


export default function SignInView() {

    const form = useForm<z.infer<typeof signinFormSchema>>({
        resolver: zodResolver(signinFormSchema),
        defaultValues: DEFAULT_VALUES
    });

    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (values: z.infer<typeof signinFormSchema>) => {

        signIn.email({
            email: values.email,
            password: values.password,
            callbackURL: "/"
        }, {
            onRequest: () => {
                setPending(true);
            },
            onError: (error) => {
                setError(error.error.message);
            },
            onResponse: () => {
                setPending(false);
            }
        })
    };


    return (
        <form id="signup-form" noValidate className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-balance text-muted-foreground">
                        Login to your {process.env.NEXT_PUBLIC_APPLICATION_NAME} account
                    </p>
                </div>
                {error && (
                    <Alert variant="destructive">
                        <TriangleAlert />
                        <AlertTitle>Login Failed</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
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
                <div className="grid gap-2">
                    <Controller
                        name="password"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <Input
                                    {...field}
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    aria-invalid={fieldState.invalid}
                                    required
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <div className="flex items-center">
                        <Link
                            href="/auth/forgot-password"
                            className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                            Forgot your password?
                        </Link>
                    </div>
                </div>
                <Button type="submit" className="w-full" disabled={pending}>
                    Login
                </Button>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
                <SocialLogins setError={setError} setPending={setPending} />
                <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/signup" className="underline underline-offset-4">
                        Sign up
                    </Link>
                </div>
            </div>
        </form>
    )
}