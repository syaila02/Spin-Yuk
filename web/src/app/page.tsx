import Link from "next/link";

import {
  Globe,
  Users,
  Zap,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10">

        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-700/20 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15),transparent_60%)]" />

      </div>

      {/* CONTAINER */}
      <div className="mx-auto flex min-h-screen max-w-[1400px] flex-col px-6 py-6">

        {/* NAVBAR */}
        <header className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-md">

          <div className="flex items-center justify-between px-10 py-6">

            <h1 className="text-5xl font-black tracking-tight text-purple-500">

              Spin-Yuk

            </h1>

            <div className="flex items-center gap-8">

              <Link
                href="/login"
                className="text-xl text-zinc-300 transition hover:text-white"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-2xl bg-gradient-to-r from-purple-500 to-violet-600 px-8 py-4 text-lg font-semibold transition duration-300 hover:scale-105"
              >
                Register
              </Link>

            </div>

          </div>

        </header>

        {/* HERO */}
        <section className="flex flex-1 flex-col items-center justify-center py-20 text-center">

          {/* BADGE */}
          <div className="rounded-full border border-purple-500/30 bg-purple-500/10 px-6 py-3 text-lg font-medium text-purple-300">

            Make Decisions Together

          </div>

          {/* TITLE */}
          <h1 className="mt-10 text-7xl font-black tracking-tight sm:text-8xl md:text-9xl">

            <span className="bg-gradient-to-r from-purple-300 via-purple-400 to-violet-600 bg-clip-text text-transparent">

              Spin-Yuk

            </span>

          </h1>

          {/* DESC */}
          <p className="mt-10 max-w-4xl text-2xl leading-[50px] text-zinc-300">

            Make decisions together in real-time with a modern collaborative spinner platform built for collaboration and fun.

          </p>

          {/* BUTTON */}
          <Link
            href="/dashboard"
            className="mt-12 rounded-3xl bg-gradient-to-r from-purple-500 to-violet-600 px-14 py-6 text-3xl font-bold shadow-2xl shadow-purple-500/30 transition duration-300 hover:scale-105"
          >
            Get Started →
          </Link>

          {/* FEATURES */}
          <div className="mt-28 grid w-full max-w-6xl grid-cols-1 gap-10 md:grid-cols-3">

            {/* CARD 1 */}
            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-14 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-purple-500/30 hover:bg-white/[0.06]">

              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500 to-violet-600">

                <Zap size={48} />

              </div>

              <h2 className="mt-10 text-5xl font-bold">

                Real-Time Spinner

              </h2>

              <p className="mt-8 text-2xl leading-[45px] text-zinc-400">

                Spin together instantly with synchronized real-time results.

              </p>

            </div>

            {/* CARD 2 */}
            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-14 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-purple-500/30 hover:bg-white/[0.06]">

              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500 to-violet-600">

                <Users size={48} />

              </div>

              <h2 className="mt-10 text-5xl font-bold">

                Collaborative Rooms

              </h2>

              <p className="mt-8 text-2xl leading-[45px] text-zinc-400">

                Invite friends and make decisions together in shared rooms.

              </p>

            </div>

            {/* CARD 3 */}
            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-14 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-purple-500/30 hover:bg-white/[0.06]">

              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500 to-violet-600">

                <Globe size={48} />

              </div>

              <h2 className="mt-10 text-5xl font-bold">

                Cross Platform

              </h2>

              <p className="mt-8 text-2xl leading-[45px] text-zinc-400">

                Available on both web and desktop platforms seamlessly.

              </p>

            </div>

          </div>

          {/* FOOTER TEXT */}
          <div className="mt-20 flex items-center gap-3 text-xl text-zinc-400">

            <span className="text-purple-500">♡</span>

            Built for collaboration and fun

          </div>

        </section>

      </div>

    </main>
  );
}