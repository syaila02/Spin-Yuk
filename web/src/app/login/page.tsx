"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import ThemeToggle from "@/components/ThemeToggle";
import { ArrowLeft, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const handleGoogleLogin = () => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-slate-950 px-6 py-10 text-white">
      <Link
        href="/"
        className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 transition hover:text-white"
      >
        <ArrowLeft size={18} />
        Back
      </Link>

      <section className="w-full max-w-xl rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Welcome back
            </p>
            <h1 className="mt-4 text-4xl font-black text-white">Login to Spin-Yuk</h1>
          </div>
          <ThemeToggle />
        </div>
        <p className="mt-4 max-w-xl text-slate-300">
          Google login unlocks profile identity, host attribution, and cross-device room updates.
        </p>

        <form
          className="mt-8 space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            toast.success("Email login is ready for backend API integration");
          }}
        >
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-300">
              Email Address
            </span>
            <span className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-4 focus-within:border-purple-500">
              <Mail size={20} className="text-purple-400" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent outline-none placeholder:text-zinc-500"
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-300">
              Password
            </span>
            <span className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-4 focus-within:border-purple-500">
              <Lock size={20} className="text-purple-400" />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full bg-transparent outline-none placeholder:text-zinc-500"
              />
            </span>
          </label>

          <button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-purple-500 to-violet-600 py-4 font-bold transition hover:scale-[1.01]"
          >
            Login
          </button>
        </form>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="mt-4 w-full rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-4 text-base font-semibold text-slate-950 shadow-[0_20px_60px_rgba(56,189,248,0.18)] transition hover:-translate-y-0.5"
        >
          Continue with Google
        </button>

        <p className="mt-8 text-center text-slate-300">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-cyan-300 hover:text-cyan-200"
          >
            Register
          </Link>
        </p>
      </section>
    </main>
  );
}