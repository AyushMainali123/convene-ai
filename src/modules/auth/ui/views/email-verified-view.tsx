"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TriangleAlert, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSearchParams } from "next/navigation";

function errorMapper(error: string) {
    switch (error) {
        case "invalid_token":
            return "Invalid verification token";
        default:
            return "We encountered an unexpected issue verifying your email.";
    }
}

export function EmailVerifiedView() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    return (
        <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">
                        {error ? "Verification Failed" : "Email Verified!"}
                    </h1>
                    <p className="text-balance text-muted-foreground">
                        {error
                            ? "We encountered an issue verifying your email"
                            : "Your email has been successfully verified"
                        }
                    </p>
                </div>

                {error ? (
                    <Alert variant="destructive">
                        <TriangleAlert />
                        <AlertTitle>Verification Error</AlertTitle>
                        <AlertDescription>{errorMapper(error)}</AlertDescription>
                    </Alert>
                ) : (
                    <Alert className="border-green-500 text-green-700 dark:text-green-400">
                        <CheckCircle2 className="text-green-500" />
                        <AlertTitle>Success!</AlertTitle>
                        <AlertDescription>
                            You can now sign in to your account and start using {process.env.NEXT_PUBLIC_APPLICATION_NAME}.
                        </AlertDescription>
                    </Alert>
                )}

                <Button asChild className="w-full">
                    <Link href="/auth/signin">
                        {error ? "Back to Sign In" : "Continue to Sign In"}
                    </Link>
                </Button>

                {error && (
                    <div className="text-center text-sm">
                        Need help?{" "}
                        <Link href="/auth/signup" className="underline underline-offset-4">
                            Create a new account
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}