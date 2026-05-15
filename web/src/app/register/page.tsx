"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, Lock, Mail, User } from "lucide-react";

export default function RegisterPage() {
  const handleGoogleLogin = () => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050816] px-6 py-10 text-white">
      <Link href="/" className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-300 transition hover:text-white">
        <ArrowLeft size={18} />
        Back
      </Link>

      <section className="w-full max-w-xl rounded-[28px] border border-white/10 bg-[#09101f]/90 p-7 shadow-[0_45px_120px_rgba(0,0,0,0.2)] sm:p-9">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Create account</p>
          <h1 className="mt-4 text-4xl font-black">Join Spin-Yuk</h1>
          <p className="mt-4 text-zinc-400">Use Google to prepare profile, room ownership, and personal spin history sync.</p>
        </div>

        <form
          className="mt-8 space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            toast.success("Register form is ready for backend API integration");
          }}
        >
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-300">Username</span>
            <span className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-4 focus-within:border-purple-500">
              <User size={20} className="text-purple-400" />
              <input type="text" placeholder="Enter your username" className="w-full bg-transparent outline-none placeholder:text-zinc-500" />
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-300">Email Address</span>
            <span className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-4 focus-within:border-purple-500">
              <Mail size={20} className="text-purple-400" />
              <input type="email" placeholder="Enter your email" className="w-full bg-transparent outline-none placeholder:text-zinc-500" />
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-300">Password</span>
            <span className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-4 focus-within:border-purple-500">
              <Lock size={20} className="text-purple-400" />
              <input type="password" placeholder="Create password" className="w-full bg-transparent outline-none placeholder:text-zinc-500" />
            </span>
          </label>

          <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-purple-500 to-violet-600 py-4 font-bold transition hover:scale-[1.01]">
            Create Account
          </button>
        </form>

        <button type="button" onClick={handleGoogleLogin} className="mt-4 w-full rounded-2xl border border-white/10 bg-white/5 py-4 font-semibold text-white transition hover:bg-white/10">
          Continue with Google
        </button>

        <p className="mt-8 text-center text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-purple-300 hover:text-purple-200">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}
