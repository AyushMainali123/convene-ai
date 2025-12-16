"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralTab } from "../components/general-tab";
import { Billing } from "../components/billing-tab";
import { IntegrationTab } from "../components/integration-tab";

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
                    <GeneralTab />
                </TabsContent>


                {/* BILLING TAB */}
                <TabsContent value="billing" className="space-y-6">
                    <Billing />
                </TabsContent>

                {/* INTEGRATIONS TAB */}
                <TabsContent value="integrations" className="space-y-6">
                    <IntegrationTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}
