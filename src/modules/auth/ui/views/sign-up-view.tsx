"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useState } from "react";
import { signUp } from "@/lib/auth-client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import SocialLogins from "../social-logins/social-logins";

const signupFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email(),
    password: z.string().min(1, "Password is required"),
});

const DEFAULT_VALUES = {
    name: "",
    email: "",
    password: ""
}


export default function SignUpView() {

    const form = useForm<z.infer<typeof signupFormSchema>>({
        resolver: zodResolver(signupFormSchema),
        defaultValues: DEFAULT_VALUES
    });

    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof signupFormSchema>) => {
        signUp.email({
            email: values.email,
            password: values.password,
            name: values.name,
            callbackURL: "/",
        }, {
            onError: (error) => {
                setError(error.error.message);
            },
            onRequest: () => {
                setPending(true);
            },
            onSuccess: () => {
                router.push("/");
            },
            onResponse: () => {
                setPending(false);
            }
        })
    };

    return (
        <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Get started</h1>
                    <p className="text-balance text-muted-foreground">
                        Create a new account
                    </p>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <TriangleAlert />
                        <AlertTitle>Signup Failed</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-2">
                    <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                                <Input
                                    {...field}
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
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
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </div>
                <Button type="submit" className="w-full" disabled={pending}>
                    Sign Up
                </Button>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
                <SocialLogins setError={setError} setPending={setPending} />
                <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/auth/signin" className="underline underline-offset-4">
                        Sign in
                    </Link>
                </div>
            </div>
        </form>
    )
}