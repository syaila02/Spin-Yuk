"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, Clock3, History, Trophy, UserRound } from "lucide-react";
import MenuShell from "@/components/dashboard/MenuShell";

type HistoryEntry = {
  id: string;
  roomCode: string;
  label: string;
  spunBy: string;
  optionCount: number;
  createdAt: string;
};

function readHistory() {
  if (typeof window === "undefined") return [];

  return Object.keys(window.localStorage)
    .filter((key) => key.startsWith("spin-yuk-room-"))
    .flatMap((key) => {
      try {
        const roomCode = key.replace("spin-yuk-room-", "");
        const parsed = JSON.parse(window.localStorage.getItem(key) || "{}") as {
          history?: Array<Partial<HistoryEntry>>;
        };

        return Array.isArray(parsed.history)
          ? parsed.history.map((item, index) => ({
              id: item.id || `${roomCode}-${index}`,
              roomCode,
              label: item.label || "Unknown result",
              spunBy: item.spunBy || "Local host",
              optionCount: Number(item.optionCount) || 0,
              createdAt: item.createdAt || new Date().toISOString(),
            }))
          : [];
      } catch {
        return [];
      }
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export default function HistoryPage() {
  const [historyData, setHistoryData] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => setHistoryData(readHistory()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const latest = historyData[0];
  const rooms = new Set(historyData.map((item) => item.roomCode)).size;

  return (
    <MenuShell active="history" title="Spin History" subtitle="Review recent spin results across your saved rooms.">
      <div className="grid gap-5 md:grid-cols-3">
        {[
          { label: "Total Spins", value: historyData.length, icon: BarChart3 },
          { label: "Active Rooms", value: rooms, icon: History },
          { label: "Latest Result", value: latest?.label || "-", icon: Trophy, compact: true },
        ].map((card) => (
          <div key={card.label} className="flex min-h-[132px] items-center gap-6 rounded-xl border border-white/10 bg-[#090d1d]/95 p-7 shadow-[0_22px_80px_rgba(0,0,0,0.18)]">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-purple-600/40 text-white shadow-[0_0_30px_rgba(124,58,237,0.55)]">
              <card.icon size={31} />
            </div>
            <div className="min-w-0">
              <p className="text-lg text-zinc-400">{card.label}</p>
              <p className={`mt-2 truncate font-black text-white ${card.compact ? "text-2xl" : "text-4xl"}`}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-white/10 bg-[#090d1d]/95 p-6 shadow-[0_22px_80px_rgba(0,0,0,0.22)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-2xl font-black">Result Timeline</h3>
            <p className="mt-2 text-zinc-400">The newest spin result appears first.</p>
          </div>
          <Link href="/dashboard" className="rounded-lg bg-white px-5 py-3 text-center font-bold text-[#090b1a] transition hover:scale-[1.02]">
            Back to Spinner
          </Link>
        </div>

        <div className="mt-6">
          {historyData.length === 0 ? (
            <div className="rounded-xl border border-dashed border-purple-500/40 bg-[#0d1022] p-14 text-center text-zinc-400">
              <Clock3 className="mx-auto mb-5 rounded-full bg-purple-500/15 p-2 text-purple-500" size={58} />
              <p className="text-lg font-semibold text-white">No spin history yet.</p>
              <p className="mt-2">Spin some options first, then the results will show up here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {historyData.map((item) => (
                <article key={item.id} className="grid gap-4 rounded-xl border border-white/10 bg-[#111629] p-5 md:grid-cols-[1fr_180px_190px] md:items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-600/40 shadow-[0_0_25px_rgba(124,58,237,0.45)]">
                      <Trophy size={25} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xl font-black">{item.label}</p>
                      <p className="mt-1 text-sm text-zinc-500">Room {item.roomCode}</p>
                    </div>
                  </div>
                  <p className="flex items-center gap-2 text-zinc-300">
                    <UserRound size={18} className="text-purple-300" />
                    {item.spunBy}
                  </p>
                  <div className="text-sm text-zinc-500 md:text-right">
                    <p>{item.optionCount} options</p>
                    <p className="mt-1">{new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </MenuShell>
  );
}
