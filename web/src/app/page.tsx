import Link from "next/link";

import ThemeToggle from "@/components/ThemeToggle";
import {
  Globe,
  Users,
  Zap,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* ENHANCED BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10">
        {/* Purple glow top left */}
        <div className="absolute -left-1/4 -top-1/4 h-[800px] w-[800px] rounded-full bg-violet-600/30 blur-3xl opacity-60" />
        
        {/* Cyan glow bottom right */}
        <div className="absolute -right-1/4 -bottom-1/4 h-[700px] w-[700px] rounded-full bg-cyan-500/20 blur-3xl opacity-40" />
        
        {/* Center radial gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.08),rgba(34,197,94,0),transparent_70%)]" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "linear-gradient(90deg, rgba(139,92,246,0.1) 1px, transparent 1px), linear-gradient(0deg, rgba(139,92,246,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }}
        />
      </div>

      {/* CONTAINER */}
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col px-4 sm:px-6 lg:px-8 py-6">

        {/* NAVBAR - Improved Glassmorphism */}
        <header className="rounded-2xl border border-white/10 bg-white/[0.02] shadow-[0_8px_32px_rgba(139,92,246,0.1)] backdrop-blur-xl">

          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 sm:px-8 sm:py-6">

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-purple-500 to-cyan-400 p-0.5 shadow-[0_8px_32px_rgba(56,189,248,0.2)]">
                <div className="rounded-[18px] bg-slate-950 px-5 py-2.5 text-base sm:text-lg font-black bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
                  Spin-Yuk
                </div>
              </div>
              <span className="hidden sm:block rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 text-xs sm:text-sm font-semibold text-cyan-200">
                Collaborative decision maker
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <Link
                href="/login"
                className="text-xs sm:text-sm font-semibold text-slate-300 transition hover:text-white"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-slate-950 shadow-[0_8px_24px_rgba(56,189,248,0.25)] transition hover:scale-105 active:scale-95"
              >
                Register
              </Link>
            </div>

          </div>

        </header>

        {/* HERO */}
        <section className="grid flex-1 gap-16 py-16 lg:py-20 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20">
          <div className="space-y-8 text-left">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2.5 text-xs sm:text-sm font-bold text-cyan-200 shadow-[0_4px_16px_rgba(34,211,238,0.1)]">
              ✨ COLLABORATIVE DECISION MAKING
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tighter text-white">
                Spin decisions with your{" "}
                <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-300 bg-clip-text text-transparent">
                  team
                </span>
                {" "}in real-time
              </h1>
              <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-slate-400">
                Spin-Yuk makes group decision-making fun, fast, and fair. Create collaborative rooms, spin the wheel, and get instant results—all with a sleek, premium interface.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold text-slate-950 shadow-[0_12px_40px_rgba(56,189,248,0.3)] transition hover:shadow-[0_16px_48px_rgba(56,189,248,0.4)] hover:-translate-y-1 active:scale-95"
              >
                Get Started Free
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold text-slate-200 shadow-[0_4px_16px_rgba(255,255,255,0.05)] transition hover:bg-white/10 hover:border-cyan-400/40 active:scale-95"
              >
                Login Now
              </Link>
            </div>
          </div>

          <div className="relative">
            {/* Glassmorphism card wrapper */}
            <div className="relative rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(139,92,246,0.15)] backdrop-blur-xl p-1 group">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500/20 via-transparent to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* 3D-like Spinner Illustration Container */}
              <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 overflow-hidden p-8 sm:p-12">
                {/* Background effects */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-3xl" />
                  <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-cyan-400/5 blur-2xl" />
                </div>

                <div className="relative flex flex-col items-center justify-center space-y-8">
                  {/* Spinner wheel - Premium 3D effect */}
                  <div className="relative">
                    <div className="relative h-64 w-64 sm:h-72 sm:w-72 rounded-full bg-gradient-to-br from-violet-500 via-purple-600 to-slate-900 shadow-[0_30px_100px_rgba(139,92,246,0.5)]">
                      {/* Glossy overlay */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-white/5 to-transparent" />
                      
                      {/* Inner sections visualization */}
                      <div className="absolute inset-8 rounded-full border-4 border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 shadow-inner" />
                      
                      {/* Center dot */}
                      <div className="absolute left-1/2 top-1/2 h-8 w-8 sm:h-10 sm:w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-cyan-300 to-cyan-500 shadow-[0_0_30px_rgba(34,211,238,0.8)]" />
                      
                      {/* Rotation indicator */}
                      <div className="absolute -top-6 left-1/2 h-6 w-1 -translate-x-1/2 rounded-full bg-gradient-to-b from-cyan-400 to-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.6)]" />
                    </div>

                    {/* Floating animation indicator */}
                    <div className="absolute -inset-6 rounded-full border border-dashed border-violet-500/30 animate-spin" style={{ animationDuration: "20s" }} />
                    <div className="absolute -inset-12 rounded-full border border-dashed border-cyan-500/20 animate-spin" style={{ animationDuration: "30s", animationDirection: "reverse" }} />
                  </div>

                  {/* Info badge */}
                  <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-5 py-3 sm:px-6 sm:py-4 text-center">
                    <p className="text-xs sm:text-sm font-semibold text-slate-400">Premium Experience</p>
                    <p className="mt-1.5 text-2xl sm:text-3xl font-black bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
                      Real-Time • Fair • Fun
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="mt-16 lg:mt-20 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
                Spin-Yuk
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
              Built for teams who want to make decisions faster, smarter, and with more style.
            </p>
          </div>

          <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="group rounded-2xl border border-white/10 bg-white/[0.04] p-8 sm:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition duration-300 hover:border-violet-400/40 hover:bg-white/[0.08] hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(139,92,246,0.15)]">
              <div className="inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-500/10 text-violet-300 shadow-[0_8px_32px_rgba(139,92,246,0.15)] group-hover:shadow-[0_12px_40px_rgba(139,92,246,0.25)] transition">
                <Zap size={28} className="sm:size-32" strokeWidth={1.5} />
              </div>
              <h3 className="mt-6 text-xl sm:text-2xl font-bold text-slate-100">Real-Time Spin</h3>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-400">
                Instant synchronized spinning with live results. Everyone sees the outcome at the same time.
              </p>
            </div>

            <div className="group rounded-2xl border border-white/10 bg-white/[0.04] p-8 sm:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition duration-300 hover:border-cyan-400/40 hover:bg-white/[0.08] hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(34,211,238,0.15)]">
              <div className="inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 text-cyan-300 shadow-[0_8px_32px_rgba(34,211,238,0.15)] group-hover:shadow-[0_12px_40px_rgba(34,211,238,0.25)] transition">
                <Users size={28} className="sm:size-32" strokeWidth={1.5} />
              </div>
              <h3 className="mt-6 text-xl sm:text-2xl font-bold text-slate-100">Collaborative Rooms</h3>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-400">
                Create unlimited rooms, share codes with friends, and collaborate seamlessly in real-time.
              </p>
            </div>

            <div className="group rounded-2xl border border-white/10 bg-white/[0.04] p-8 sm:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition duration-300 hover:border-violet-400/40 hover:bg-white/[0.08] hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(139,92,246,0.15)]">
              <div className="inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-500/10 text-violet-300 shadow-[0_8px_32px_rgba(139,92,246,0.15)] group-hover:shadow-[0_12px_40px_rgba(139,92,246,0.25)] transition">
                <Globe size={28} className="sm:size-32" strokeWidth={1.5} />
              </div>
              <h3 className="mt-6 text-xl sm:text-2xl font-bold text-slate-100">Cross Platform</h3>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-400">
                Use on web, desktop, or mobile. Same premium experience everywhere you go.
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER TEXT */}
        <footer className="mt-16 sm:mt-20 pt-12 border-t border-white/10 text-center pb-4">
          <p className="text-xs sm:text-sm text-slate-500">
            © 2026 Spin-Yuk. Collaborative decision-making made simple, fast, and fun.
          </p>
        </footer>

      </div>

    </main>
  );
}