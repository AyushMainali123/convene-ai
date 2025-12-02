import { Card, CardContent } from "@/components/ui/card"

interface IAuthLayoutPageProps {
    children: React.ReactNode
}

export default function AuthLayoutPage({ children }: IAuthLayoutPageProps) {
    return (
        <div className="bg-muted min-h-screen flex items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                <div className="flex flex-col gap-6">
                    <Card className="overflow-hidden p-0">
                        <CardContent className="grid p-0 md:grid-cols-2">
                            {children}
                            <div className="relative hidden bg-muted md:block">
                                <div className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale bg-zinc-900" />
                                <div className="absolute inset-0 flex items-center justify-center text-zinc-400 font-bold text-3xl opacity-20">
                                    AI SAAS
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                        and <a href="#">Privacy Policy</a>.
                    </div>
                </div>
            </div>
        </div>
    )
}