"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession, } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {

  const { data: session } = useSession();
  const router = useRouter();


  function handleSignOut() {
    signOut();
    router.push("/auth/signin");
  }

  return (
    <div>
      {session?.user ? (
        <div>
          <p>Logged in as {session.user.email}</p>
          <Button onClick={handleSignOut}>Sign Out</Button>
        </div>
      ) : (
        <div>
          <p>Not logged in</p>
          <Link href="/auth/signin">
            <Button>Sign In</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
