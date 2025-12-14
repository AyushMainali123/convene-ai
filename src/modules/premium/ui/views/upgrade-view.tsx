"use client";

import { ErrorState, IErrorStateProps } from "@/components/ui/error-state"
import { LoadingState } from "@/components/ui/loading-state"
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query"
import { PricingCard } from "../components/pricing-card";

export default function UpgradeView() {
    const trpc = useTRPC();
    const { data: products } = useSuspenseQuery(trpc.premium.getProducts.queryOptions());
    const { data: currentSubscription } = useSuspenseQuery(trpc.premium.getCurrentSubscription.queryOptions());

    const standardPlan = products.find(product => product.name === "Standard");
    const yearlyPlan = products.find(product => product.name === "Yearly");
    const enterprisePlan = products.find(product => product.name === "Enterprise");

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 md:py-16">
            <div className="text-center mb-12 space-y-4">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                    Upgrade your plan
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Unlock advanced features and power up your workflow with our premium plans.
                </p>
            </div>

            <div className="bg-muted/50 border rounded-lg p-4 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl mx-auto">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Current Plan:</span>
                    <span className="font-semibold text-foreground capitalize">
                        {currentSubscription?.name ?? "Free"}
                    </span>
                </div>
                {/* Optional: Add a 'Manage Subscription' button here if already premium and not needing broad options */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">

                {
                    [standardPlan, yearlyPlan, enterprisePlan].map(product => {
                        if (!product) return null;
                        const isCurrentProduct = product.id === currentSubscription?.id;
                        const isPremium = !!currentSubscription;

                        let buttonText = "Upgrade";
                        let onClick = () => (authClient as any).checkout({
                            products: [product.id]
                        });

                        if (isCurrentProduct) {
                            buttonText = "Manage Subscription";
                            onClick = () => {
                                (authClient as any).customer.portal();
                            }
                        } else if (isPremium) {
                            buttonText = "Switch Plan";
                            onClick = () => {
                                (authClient as any).customer.portal();
                            }
                        }
                        return (
                            <PricingCard
                                key={product.id}
                                variant={product.metadata.variant === "highlighted" ? "highlighted" : "default"}
                                badge={product.metadata.variant === "highlighted" ? "Most Popular" : undefined}
                                price={product.prices[0].amountType === "fixed" ? product.prices[0].priceAmount / 100 : 0}
                                features={product.benefits.map(benefit => benefit.description)}
                                title={product.name}
                                description={product.description ?? "Perfect for growing teams"}
                                priceSuffix={`/${product.prices[0].recurringInterval}`}
                                className="w-full h-full flex flex-col"
                                buttonText={buttonText}
                                onClick={onClick}
                            />
                        )
                    })
                }
            </div>
        </div>
    )
}


export const UpgradeViewLoadingState = () => {
    return (
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
            <LoadingState title="Loading" description="Please wait while we load the page" />
        </div>
    )
}


export const UpgradeViewErrorState = (props: IErrorStateProps) => {
    return (
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
            <ErrorState {...props} />
        </div>
    )
}