import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

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
                                <Image draggable={false} src="/auth-cover.png" alt="Auth Cover" fill className="object-cover" />
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