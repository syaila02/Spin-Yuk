"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) return;

    localStorage.setItem("token", token);

    const payload = JSON.parse(atob(token.split(".")[1]));

    localStorage.setItem(
      "spin-yuk-google-profile",
      JSON.stringify({
        name: payload.name,
        email: payload.email,
      })
    );

    router.push("/dashboard");
  }, [token, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050816] px-6 text-white">
      <section className="w-full max-w-xl rounded-[28px] border border-white/10 bg-[#09101f] p-8 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Google OAuth
        </p>
        <h1 className="mt-4 text-3xl font-black">Authentication callback</h1>
        <p className="mt-4 text-zinc-400">
          {token ? "Login berhasil. Mengarahkan ke dashboard..." : "Token tidak ditemukan."}
        </p>
        <Link
          href="/dashboard"
          className="mt-8 inline-flex rounded-2xl bg-purple-600 px-6 py-3 font-semibold text-white"
        >
          Open dashboard
        </Link>
      </section>
    </main>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#050816] px-6 text-white">
          <p className="text-zinc-400">Preparing Google authentication...</p>
        </main>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}