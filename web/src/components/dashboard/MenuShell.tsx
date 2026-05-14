"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Clock3, Home, Settings, Users } from "lucide-react";

type MenuShellProps = {
  active: "dashboard" | "rooms" | "history" | "settings";
  title: string;
  subtitle: string;
  children: ReactNode;
};

const menuItems = [
  { key: "dashboard", label: "Dashboard", href: "/dashboard", icon: Home },
  { key: "rooms", label: "Rooms", href: "/rooms", icon: Users },
  { key: "history", label: "History", href: "/history", icon: Clock3 },
  { key: "settings", label: "Settings", href: "/settings", icon: Settings },
] as const;

export default function MenuShell({ active, title, subtitle, children }: MenuShellProps) {
  return (
    <main className="min-h-screen bg-[#030616] text-white">
      <div className="mx-auto flex min-h-screen max-w-[1880px] gap-6 p-3 md:p-5">
        <aside className="hidden w-[320px] shrink-0 flex-col rounded-2xl border border-white/10 bg-[#080b1a]/95 p-8 shadow-[0_30px_120px_rgba(0,0,0,0.35)] lg:flex">
          <h1 className="text-4xl font-black tracking-tight text-purple-400">Spin-Yuk</h1>

          <nav className="mt-9 space-y-4">
            {menuItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`flex w-full items-center gap-4 rounded-xl px-5 py-4 text-left text-lg font-semibold transition ${
                  active === item.key
                    ? "bg-gradient-to-r from-purple-600 to-violet-700 shadow-[0_18px_45px_rgba(124,58,237,0.35)]"
                    : "text-zinc-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={24} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto rounded-xl border border-white/10 bg-[#0d1021] p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-violet-700 text-2xl font-black shadow-[0_0_25px_rgba(124,58,237,0.65)]">
                K
              </div>
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold">Kibar</p>
                <p className="text-sm text-emerald-400">● Online</p>
              </div>
            </div>
          </div>
        </aside>

        <section className="flex-1 space-y-6">
          <header className="rounded-xl border border-white/10 bg-[#090d1d]/95 p-7 shadow-[0_22px_80px_rgba(0,0,0,0.25)]">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-purple-300">Spin-Yuk</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{title}</h2>
            <p className="mt-4 text-lg text-zinc-400">{subtitle}</p>
          </header>

          {children}
        </section>
      </div>
    </main>
  );
}
