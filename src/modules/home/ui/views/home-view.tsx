"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function HomeView() {

    const { data: session } = useSession();

    const router = useRouter();

    const handleSignOut = () => {
        signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/auth/signin");
                }
            }
        });
    };


    return (

        <div>
            <p>Logged in as {session?.user?.name}</p>
            <Button onClick={handleSignOut}>Sign Out</Button>
        </div>

    )
}