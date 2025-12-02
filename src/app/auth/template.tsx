import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface IAuthTemplateProps {
    children: React.ReactNode;
}

export default async function AuthTemplate({ children }: IAuthTemplateProps) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (session?.user) {
        return redirect("/");
    }

    return children;
}