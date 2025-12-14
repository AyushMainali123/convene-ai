"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Globe, Lock, Mail, User, Zap } from "lucide-react";

export const SettingsView = () => {
    return (
        <div className="flex flex-col gap-6 p-6 max-w-6xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground text-lg">
                    Manage your account settings and preferences.
                </p>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-[400px] h-10 mb-6">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
                    <TabsTrigger value="integrations">Integrations</TabsTrigger>
                </TabsList>

                {/* GENERAL TAB */}
                <TabsContent value="general" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Update your account profile details and preferences.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Display Name</Label>
                                <Input id="name" placeholder="Your Name" defaultValue="Test User" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" placeholder="email@example.com" defaultValue="user@example.com" disabled />
                                <p className="text-[0.8rem] text-muted-foreground">
                                    Email addresses cannot be changed directly. Contact support for assistance.
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            <Button>Save Changes</Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Preferences</CardTitle>
                            <CardDescription>
                                Manage your regional settings and language.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="language">Language</Label>
                                <select
                                    id="language"
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="en">English (United States)</option>
                                    <option value="es">Spanish</option>
                                    <option value="fr">French</option>
                                </select>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            <Button variant="secondary">Save Preferences</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* BILLING TAB */}
                <TabsContent value="billing" className="space-y-6">
                    <Card className="border-sidebar-primary/20 bg-sidebar-primary/5">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl">Free Plan</CardTitle>
                                    <CardDescription>You are currently on the free plan.</CardDescription>
                                </div>
                                <Badge variant="secondary" className="bg-primary/10 text-primary text-sm px-3 py-1">
                                    Active
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">Total Agents</span>
                                    <span className="text-muted-foreground">3 / 5</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-secondary">
                                    <div className="h-full w-[60%] rounded-full bg-primary" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">Meetings Processed</span>
                                    <span className="text-muted-foreground">12 / 50</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-secondary">
                                    <div className="h-full w-[24%] rounded-full bg-primary" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t border-sidebar-primary/10 px-6 py-4 flex justify-end items-center">
                            <Button className="font-semibold">
                                <Zap className="mr-2 h-4 w-4" />
                                Upgrade to Pro
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Method</CardTitle>
                            <CardDescription>Manage your payment details and billing history.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                            <div className="p-3 bg-muted rounded-full">
                                <CreditCard className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-medium">No payment method added</h3>
                                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                    You haven't added a payment method yet. Add one to upgrade your plan.
                                </p>
                            </div>
                            <Button variant="outline">Add Payment Method</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* INTEGRATIONS TAB */}
                <TabsContent value="integrations" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Connected Services</CardTitle>
                            <CardDescription>
                                Manage connections to third-party services and tools.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center size-10 rounded-lg bg-indigo-100 text-indigo-600">
                                        <Lock className="size-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-medium leading-none">Webhook</p>
                                        <p className="text-sm text-muted-foreground">
                                            Send meeting summaries to a custom URL.
                                        </p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">Configure</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
