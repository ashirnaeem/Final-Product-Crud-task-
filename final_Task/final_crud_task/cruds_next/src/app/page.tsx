"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";

export default function Home() {
  const { user } = useUser();

  if (!user) {
    return;
    // <Link href="/api/auth/login">Login</Link>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>
  );
}
