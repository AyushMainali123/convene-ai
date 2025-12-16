import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface IAuthLayoutPageProps {
    children: React.ReactNode
}

export default function AuthLayoutPage({ children }: IAuthLayoutPageProps) {
    return (
        <div className="bg-muted min-h-screen flex items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    <Card className="overflow-hidden p-0">
                        <CardContent className="grid p-0">
                            {children}

                        </CardContent>
                    </Card>
                    <div className="text-balance text-center text-xs text-muted-foreground">
                        By clicking continue, you agree to our <Link href="#" className="underline underline-offset-4 hover:text-primary">Terms of Service</Link>{" "}
                        and <Link href="#" className="underline underline-offset-4 hover:text-primary">Privacy Policy</Link>.
                    </div>
                </div>
            </div>
        </div>
    )
}