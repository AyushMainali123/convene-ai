import 'server-only';

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { polar, checkout, portal, usage } from "@polar-sh/better-auth";
import { polarClient } from "./polar";
import { resend } from "./resend";


if (!process.env.RESEND_SENDER_EMAIL_ADDRESS) {
    throw new Error("RESEND_SENDER_EMAIL_ADDRESS is not defined");
}

if (!process.env.NEXT_PUBLIC_APPLICATION_NAME) {
    throw new Error("NEXT_PUBLIC_APPLICATION_NAME is not defined");
}

export const auth = betterAuth({
    plugins: [
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    authenticatedUsersOnly: true,
                    successUrl: "/upgrade",
                }),
                portal(),
                usage(),
            ],
        }) as any,
    ],

    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),

    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            const verificationUrl = new URL(url);
            verificationUrl.searchParams.set("callbackURL", "/auth/email-verified");
            try {
                await resend.emails.send({
                    from: `${process.env.NEXT_PUBLIC_APPLICATION_NAME} <${process.env.RESEND_SENDER_EMAIL_ADDRESS}>`,
                    to: user.email,
                    subject: "Verify your email address",
                    html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2>Welcome to ${process.env.NEXT_PUBLIC_APPLICATION_NAME}!</h2>
                        <p>Hi ${user.name || 'there'},</p>
                        <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
                        <a href="${verificationUrl.toString()}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Verify Email</a>
                        <p>Or copy and paste this link into your browser:</p>
                        <p style="color: #666; word-break: break-all;">${verificationUrl.toString()}</p>
                        <p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't create an account, you can safely ignore this email.</p>
                    </div>
                `,
                });
            } catch (error) {
                console.error("Failed to send verification email:", error);
                throw error;
            }
        },
        sendOnSignIn: true,
        sendOnSignUp: true,
    },

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }) => {
            try {
                await resend.emails.send({
                    from: `${process.env.NEXT_PUBLIC_APPLICATION_NAME} <${process.env.RESEND_SENDER_EMAIL_ADDRESS}>`,
                    to: user.email,
                    subject: "Reset your password",
                    html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2>Password Reset Request</h2>
                        <p>Hi ${user.name || 'there'},</p>
                        <p>We received a request to reset your password. Click the button below to create a new password:</p>
                        <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
                        <p>Or copy and paste this link into your browser:</p>
                        <p style="color: #666; word-break: break-all;">${url}</p>
                        <p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
                    </div>
                `,
                });
            } catch (error) {
                console.error("Failed to send reset password email:", error);
                throw error;
            }
        },
    },

    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
});