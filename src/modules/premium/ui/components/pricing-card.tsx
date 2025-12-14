import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { Check } from "lucide-react";

const pricingCardVariants = cva("flex flex-col justify-between relative overflow-hidden transition-all duration-300 ease-in-out", {
    variants: {
        variant: {
            default: "border-border shadow-sm hover:shadow-md bg-card",
            highlighted: "border-primary shadow-xl scale-[1.02] z-10 bg-card ring-1 ring-primary/20"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});


interface IPricingCardProps extends VariantProps<typeof pricingCardVariants> {
    badge?: string | null;
    price: number;
    features: string[];
    title: string;
    description?: string;
    priceSuffix: string;
    className?: string;
    buttonText: string;
    onClick: () => void;
}

export function PricingCard({
    variant,
    badge,
    price,
    features,
    title,
    description,
    priceSuffix,
    className,
    buttonText,
    onClick
}: IPricingCardProps) {
    return (
        <Card className={cn(pricingCardVariants({ variant }), className)}>
            <CardHeader className="pb-4">
                <div className="flex justify-between items-center mb-4">
                    <CardTitle className={cn("text-lg font-semibold text-muted-foreground", variant === "highlighted" && "text-primary")}>
                        {title}
                    </CardTitle>
                    {!!badge && (
                        <Badge variant={variant === "highlighted" ? "default" : "secondary"} className="h-6">
                            {badge}
                        </Badge>
                    )}
                </div>

                <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-5xl font-bold tracking-tight">
                        {Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }).format(price)}
                    </span>
                    <span className="text-muted-foreground font-medium text-lg">
                        /{priceSuffix}
                    </span>
                </div>

                <CardDescription className="text-base min-h-[50px]">
                    {description}
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 pt-0">
                <div className="w-full h-px bg-border mb-6" />
                <div className="space-y-4">
                    <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Features</p>
                    <ul className="space-y-3">
                        {features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-3 text-sm text-foreground/90">
                                <Check className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                                <span className="leading-relaxed">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>

            <CardFooter className="pt-8 pb-8">
                <Button
                    className="w-full h-11 text-base font-semibold shadow-sm"
                    onClick={onClick}
                    variant={variant === "highlighted" ? "default" : "outline"}
                >
                    {buttonText}
                </Button>
            </CardFooter>
        </Card>
    )
}
