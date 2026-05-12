"use client";

import Link from "next/link";

import {
  ArrowLeft,
  Lock,
  Mail,
  User,
} from "lucide-react";

export default function RegisterPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050816] px-6 text-white">

      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10">

        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-700/20 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15),transparent_60%)]" />

      </div>

      {/* BACK BUTTON */}
      <Link
        href="/"
        className="absolute left-8 top-8 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-zinc-300 backdrop-blur-md transition duration-300 hover:border-purple-500/30 hover:text-white"
      >
        <ArrowLeft size={20} />

        Back
      </Link>

      {/* CARD */}
      <div className="w-full max-w-2xl rounded-[40px] border border-white/10 bg-white/[0.04] p-12 backdrop-blur-xl">

        {/* HEADER */}
        <div className="text-center">

          <h1 className="text-6xl font-black tracking-tight">

            <span className="bg-gradient-to-r from-purple-300 via-purple-400 to-violet-600 bg-clip-text text-transparent">

              Create Account

            </span>

          </h1>

          <p className="mt-6 text-xl leading-9 text-zinc-400">

            Join Spin-Yuk and start collaborating with your friends in real-time.

          </p>

        </div>

        {/* FORM */}
        <form className="mt-12 space-y-8">

          {/* USERNAME */}
          <div>

            <label className="mb-3 block text-lg font-medium text-zinc-300">

              Username

            </label>

            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/30 px-6 py-5 transition duration-300 focus-within:border-purple-500">

              <User
                size={24}
                className="text-purple-400"
              />

              <input
                type="text"
                placeholder="Enter your username"
                className="w-full bg-transparent text-lg outline-none placeholder:text-zinc-500"
              />

            </div>

          </div>

          {/* EMAIL */}
          <div>

            <label className="mb-3 block text-lg font-medium text-zinc-300">

              Email Address

            </label>

            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/30 px-6 py-5 transition duration-300 focus-within:border-purple-500">

              <Mail
                size={24}
                className="text-purple-400"
              />

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent text-lg outline-none placeholder:text-zinc-500"
              />

            </div>

          </div>

          {/* PASSWORD */}
          <div>

            <label className="mb-3 block text-lg font-medium text-zinc-300">

              Password

            </label>

            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/30 px-6 py-5 transition duration-300 focus-within:border-purple-500">

              <Lock
                size={24}
                className="text-purple-400"
              />

              <input
                type="password"
                placeholder="Create password"
                className="w-full bg-transparent text-lg outline-none placeholder:text-zinc-500"
              />

            </div>

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full rounded-3xl bg-gradient-to-r from-purple-500 to-violet-600 py-5 text-2xl font-bold shadow-2xl shadow-purple-500/30 transition duration-300 hover:scale-[1.02]"
          >
            Create Account
          </button>

        </form>

        {/* FOOTER */}
        <div className="mt-10 text-center text-lg text-zinc-400">

          Already have an account?{" "}

          <Link
            href="/login"
            className="font-semibold text-purple-400 transition hover:text-purple-300"
          >
            Login
          </Link>

        </div>

      </div>

    </main>
  );
}