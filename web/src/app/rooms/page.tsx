"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock3, DoorOpen, List, Plus, Trophy, Users } from "lucide-react";
import MenuShell from "@/components/dashboard/MenuShell";

type RoomSummary = {
  code: string;
  name: string;
  options: number;
  history: number;
  updatedAt: string;
};

function readRooms() {
  if (typeof window === "undefined") return [];

  return Object.keys(window.localStorage)
    .filter((key) => key.startsWith("spin-yuk-room-"))
    .map((key) => {
      try {
        const parsed = JSON.parse(window.localStorage.getItem(key) || "{}") as {
          name?: string;
          options?: unknown[];
          history?: unknown[];
          updatedAt?: string;
        };
        const code = key.replace("spin-yuk-room-", "");

        return {
          code,
          name: parsed.name || `Room ${code}`,
          options: Array.isArray(parsed.options) ? parsed.options.length : 0,
          history: Array.isArray(parsed.history) ? parsed.history.length : 0,
          updatedAt: parsed.updatedAt || new Date().toISOString(),
        };
      } catch {
        return null;
      }
    })
    .filter((room): room is RoomSummary => Boolean(room))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<RoomSummary[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => setRooms(readRooms()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const totalOptions = rooms.reduce((sum, room) => sum + room.options, 0);
  const totalSpins = rooms.reduce((sum, room) => sum + room.history, 0);

  return (
    <MenuShell active="rooms" title="Rooms" subtitle="Manage your saved spinner rooms and jump back into a session.">
      <div className="grid gap-5 md:grid-cols-3">
        {[
          { label: "Saved Rooms", value: rooms.length, icon: DoorOpen },
          { label: "Total Options", value: totalOptions, icon: List },
          { label: "Total Spins", value: totalSpins, icon: Trophy },
        ].map((card) => (
          <div key={card.label} className="flex min-h-[132px] items-center gap-6 rounded-xl border border-white/10 bg-[#090d1d]/95 p-7 shadow-[0_22px_80px_rgba(0,0,0,0.18)]">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-purple-600/40 text-white shadow-[0_0_30px_rgba(124,58,237,0.55)]">
              <card.icon size={31} />
            </div>
            <div>
              <p className="text-lg text-zinc-400">{card.label}</p>
              <p className="mt-2 text-4xl font-black text-white">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-white/10 bg-[#090d1d]/95 p-6 shadow-[0_22px_80px_rgba(0,0,0,0.22)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-2xl font-black">Room List</h3>
            <p className="mt-2 text-zinc-400">Rooms are stored locally in this browser.</p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-violet-700 px-5 py-3 font-bold shadow-[0_18px_45px_rgba(124,58,237,0.28)] transition hover:scale-[1.02]"
          >
            <Plus size={19} />
            New Room
          </Link>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {rooms.length === 0 ? (
            <div className="col-span-full rounded-xl border border-dashed border-purple-500/40 bg-[#0d1022] p-12 text-center text-zinc-400">
              <DoorOpen className="mx-auto mb-5 rounded-full bg-purple-500/15 p-2 text-purple-500" size={58} />
              <p className="text-lg font-semibold text-white">No rooms yet.</p>
              <p className="mt-2">Create or open the dashboard to start saving a room.</p>
            </div>
          ) : (
            rooms.map((room) => (
              <article key={room.code} className="rounded-xl border border-white/10 bg-[#111629] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-zinc-500">Room Code</p>
                    <h4 className="mt-1 text-3xl font-black text-purple-300">{room.code}</h4>
                  </div>
                  <Link href={`/room/${encodeURIComponent(room.code)}`} className="rounded-lg bg-white px-4 py-2 font-bold text-[#090b1a] transition hover:scale-[1.02]">
                    Open
                  </Link>
                </div>
                <p className="mt-4 text-lg font-semibold">{room.name}</p>
                <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                  <div className="rounded-lg bg-white/5 p-3">
                    <p className="text-zinc-500">Options</p>
                    <p className="mt-1 text-xl font-black">{room.options}</p>
                  </div>
                  <div className="rounded-lg bg-white/5 p-3">
                    <p className="text-zinc-500">Spins</p>
                    <p className="mt-1 text-xl font-black">{room.history}</p>
                  </div>
                  <div className="rounded-lg bg-white/5 p-3">
                    <p className="text-zinc-500">Members</p>
                    <p className="mt-1 text-xl font-black">
                      <Users className="mr-1 inline" size={18} />
                      3
                    </p>
                  </div>
                </div>
                <p className="mt-4 flex items-center gap-2 text-sm text-zinc-500">
                  <Clock3 size={16} />
                  Last updated {new Date(room.updatedAt).toLocaleString()}
                </p>
              </article>
            ))
          )}
        </div>
      </section>
    </MenuShell>
  );
}
