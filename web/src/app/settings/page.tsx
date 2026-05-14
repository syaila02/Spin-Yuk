"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Bell, Database, Lock, Palette, RotateCcw, Save, ShieldCheck } from "lucide-react";
import MenuShell from "@/components/dashboard/MenuShell";

type SettingsState = {
  sound: boolean;
  notifications: boolean;
  autoRemoveWinner: boolean;
  compactHistory: boolean;
};

const defaultSettings: SettingsState = {
  sound: true,
  notifications: true,
  autoRemoveWinner: true,
  compactHistory: false,
};

function readSettings() {
  if (typeof window === "undefined") return defaultSettings;

  try {
    const saved = window.localStorage.getItem("spin-yuk-settings");
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

function getStorageSummary() {
  if (typeof window === "undefined") return { rooms: 0, keys: 0 };

  const keys = Object.keys(window.localStorage).filter((key) => key.startsWith("spin-yuk"));
  return {
    rooms: keys.filter((key) => key.startsWith("spin-yuk-room-")).length,
    keys: keys.length,
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [storage, setStorage] = useState({ rooms: 0, keys: 0 });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSettings(readSettings());
      setStorage(getStorageSummary());
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const updateSetting = (key: keyof SettingsState) => {
    setSettings((current) => ({ ...current, [key]: !current[key] }));
  };

  const saveSettings = () => {
    window.localStorage.setItem("spin-yuk-settings", JSON.stringify(settings));
    toast.success("Settings saved");
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    window.localStorage.setItem("spin-yuk-settings", JSON.stringify(defaultSettings));
    toast.success("Settings reset");
  };

  return (
    <MenuShell active="settings" title="Settings" subtitle="Tune local preferences for your Spin-Yuk workspace.">
      <Toaster position="top-right" />

      <div className="grid gap-5 xl:grid-cols-[1fr_430px]">
        <section className="rounded-xl border border-white/10 bg-[#090d1d]/95 p-6 shadow-[0_22px_80px_rgba(0,0,0,0.22)]">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-600/40 shadow-[0_0_30px_rgba(124,58,237,0.55)]">
              <Palette size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black">Preferences</h3>
              <p className="mt-1 text-zinc-400">These settings are saved in your browser.</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {[
              { key: "sound", title: "Spin sound effects", desc: "Prepare audio feedback for spin actions.", icon: Bell },
              { key: "notifications", title: "Result notifications", desc: "Show toast notifications after important actions.", icon: ShieldCheck },
              { key: "autoRemoveWinner", title: "Auto remove winner", desc: "Keep selected results out of the next round.", icon: RotateCcw },
              { key: "compactHistory", title: "Compact history view", desc: "Use denser rows when showing long history lists.", icon: Database },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => updateSetting(item.key as keyof SettingsState)}
                className="flex w-full items-center justify-between gap-5 rounded-xl border border-white/10 bg-[#111629] p-5 text-left transition hover:bg-white/[0.07]"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/5 text-purple-300">
                    <item.icon size={23} />
                  </div>
                  <div>
                    <p className="text-lg font-bold">{item.title}</p>
                    <p className="mt-1 text-sm text-zinc-500">{item.desc}</p>
                  </div>
                </div>
                <span
                  className={`flex h-7 w-12 items-center rounded-full p-1 transition ${
                    settings[item.key as keyof SettingsState] ? "bg-purple-500" : "bg-zinc-700"
                  }`}
                >
                  <span className={`h-5 w-5 rounded-full bg-white transition ${settings[item.key as keyof SettingsState] ? "translate-x-5" : ""}`} />
                </span>
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={saveSettings}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-violet-700 px-5 py-3 font-bold shadow-[0_18px_45px_rgba(124,58,237,0.28)] transition hover:scale-[1.02]"
            >
              <Save size={19} />
              Save Settings
            </button>
            <button type="button" onClick={resetSettings} className="rounded-lg border border-white/10 bg-white/5 px-5 py-3 font-bold text-zinc-300 transition hover:bg-white/10">
              Reset
            </button>
          </div>
        </section>

        <aside className="space-y-5">
          <section className="rounded-xl border border-white/10 bg-[#090d1d]/95 p-6 shadow-[0_22px_80px_rgba(0,0,0,0.18)]">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-600/40 shadow-[0_0_30px_rgba(124,58,237,0.55)]">
                <Database size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black">Local Storage</h3>
                <p className="mt-1 text-sm text-zinc-500">Browser-only data summary.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <div className="rounded-xl border border-white/10 bg-[#111629] p-4">
                <p className="text-zinc-500">Saved rooms</p>
                <p className="mt-1 text-3xl font-black">{storage.rooms}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#111629] p-4">
                <p className="text-zinc-500">Spin-Yuk keys</p>
                <p className="mt-1 text-3xl font-black">{storage.keys}</p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-[#090d1d]/95 p-6 shadow-[0_22px_80px_rgba(0,0,0,0.18)]">
            <div className="flex items-center gap-3">
              <Lock className="text-purple-400" size={26} />
              <h3 className="text-xl font-black">Privacy</h3>
            </div>
            <p className="mt-4 leading-7 text-zinc-400">
              Room options, history, and preferences are currently stored locally in this browser. Backend sync can be attached later without changing this page layout.
            </p>
          </section>
        </aside>
      </div>
    </MenuShell>
  );
}
