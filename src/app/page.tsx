"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUp } from "@/lib/auth-client";
import { useState } from "react";

export default function Home() {

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await signUp.email({
        email,
        password,
        name,
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="mx-auto max-w-xl flex items-center justify-center h-screen">
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <Input placeholder="Enter your name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Enter your email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Enter your password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit">Sign Up</Button>
      </form>
    </div>
  );
}
