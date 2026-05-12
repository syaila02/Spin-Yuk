"use client";

import { useEffect, useState } from "react";

import toast, { Toaster } from "react-hot-toast";

import {
  History,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";

export default function DashboardPage() {

  const [options, setOptions] = useState([
    "Burger",
    "Sushi",
    "Mie Ayam",
    "Nasi Goreng",
  ]);

  const [input, setInput] = useState("");

  const [result, setResult] = useState("-");

  const [historyData, setHistoryData] = useState<string[]>([]);

  const [isSpinning, setIsSpinning] = useState(false);

  const participants = [
    {
      name: "Kibar",
      status: "Online",
    },
    {
      name: "Syaila",
      status: "Offline",
    },
    {
      name: "Auliya",
      status: "Online",
    },
  ];

  useEffect(() => {

    const savedOptions =
      localStorage.getItem("spin-options");

    const savedHistory =
      localStorage.getItem("spin-history");

    if (savedOptions) {

      setOptions(JSON.parse(savedOptions));
    }

    if (savedHistory) {

      setHistoryData(JSON.parse(savedHistory));
    }

  }, []);

  useEffect(() => {

    localStorage.setItem(
      "spin-options",
      JSON.stringify(options)
    );

  }, [options]);

  useEffect(() => {

    localStorage.setItem(
      "spin-history",
      JSON.stringify(historyData)
    );

  }, [historyData]);

  const handleAddOption = () => {

    if (!input.trim()) {

      toast.error("Option cannot be empty");

      return;
    }

    if (options.includes(input)) {

      toast.error("Option already exists");

      return;
    }

    setOptions([...options, input]);

    toast.success("Option added");

    setInput("");
  };

  const handleDeleteOption = (index: number) => {

    setOptions(options.filter((_, i) => i !== index));

    toast.success("Option deleted");
  };

  const handleSpin = () => {

    if (options.length === 0) return;

    if (isSpinning) return;

    setIsSpinning(true);

    const interval = setInterval(() => {

      const randomOption =
        options[
          Math.floor(
            Math.random() * options.length
          )
        ];

      setResult(randomOption);

    }, 100);

    setTimeout(() => {

      clearInterval(interval);

      const finalResult =
        options[
          Math.floor(
            Math.random() * options.length
          )
        ];

      setResult(finalResult);

      toast.success(`Selected: ${finalResult}`);

      setHistoryData((prev) => [
        finalResult,
        ...prev,
      ]);

      setIsSpinning(false);

    }, 3000);
  };

  return (
    <main className="min-h-screen bg-[#050816] text-white">

      <Toaster position="top-right" />

      <div className="mx-auto flex min-h-screen max-w-[1800px]">

        {/* SIDEBAR */}
        <aside className="hidden w-[320px] flex-col border-r border-white/10 bg-black/20 p-8 backdrop-blur-xl lg:flex">

          <h1 className="text-5xl font-black tracking-tight text-purple-500">

            Spin-Yuk

          </h1>

          <nav className="mt-14 space-y-4">

            <button className="flex w-full items-center gap-4 rounded-2xl bg-gradient-to-r from-purple-500 to-violet-600 px-6 py-5 text-xl font-semibold">

              <LayoutDashboard size={24} />

              Dashboard

            </button>

            <button className="flex w-full items-center gap-4 rounded-2xl px-6 py-5 text-xl text-zinc-400 transition hover:bg-white/5 hover:text-white">

              <Users size={24} />

              Rooms

            </button>

            <button className="flex w-full items-center gap-4 rounded-2xl px-6 py-5 text-xl text-zinc-400 transition hover:bg-white/5 hover:text-white">

              <History size={24} />

              History

            </button>

            <button className="flex w-full items-center gap-4 rounded-2xl px-6 py-5 text-xl text-zinc-400 transition hover:bg-white/5 hover:text-white">

              <Settings size={24} />

              Settings

            </button>

          </nav>

          <div className="mt-auto rounded-3xl border border-white/10 bg-white/[0.04] p-6">

            <div className="flex items-center gap-4">

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-violet-600 text-2xl font-bold">

                K

              </div>

              <div>

                <h2 className="text-xl font-bold">

                  Kibar

                </h2>

                <p className="text-green-400">

                  Online

                </p>

              </div>

            </div>

          </div>

        </aside>

        {/* MAIN */}
        <section className="flex-1 p-8 lg:p-12">

          {/* HEADER */}
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

            <div>

              <h1 className="text-5xl font-black">

                Welcome back, Kibar! 👋

              </h1>

              <p className="mt-4 text-xl text-zinc-400">

                Spin and collaborate with your friends in real-time.

              </p>

            </div>

            <div className="rounded-3xl border border-purple-500/30 bg-purple-500/10 px-8 py-6">

              <p className="text-lg text-zinc-400">

                Room Code

              </p>

              <h2 className="mt-2 text-4xl font-black text-purple-400">

                SPIN-2026

              </h2>

            </div>

          </div>

          {/* STATS */}
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">

              <p className="text-lg text-zinc-400">

                Total Options

              </p>

              <h2 className="mt-4 text-5xl font-black text-purple-400">

                {options.length}

              </h2>

            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">

              <p className="text-lg text-zinc-400">

                Participants

              </p>

              <h2 className="mt-4 text-5xl font-black text-purple-400">

                {participants.length}

              </h2>

            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">

              <p className="text-lg text-zinc-400">

                Spinner Status

              </p>

              <h2 className="mt-4 text-5xl font-black text-purple-400">

                {isSpinning ? "Spinning..." : "Ready"}

              </h2>

            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">

              <p className="text-lg text-zinc-400">

                Total Spins

              </p>

              <h2 className="mt-4 text-5xl font-black text-purple-400">

                {historyData.length}

              </h2>

            </div>

          </div>

          {/* INPUT */}
          <div className="mt-10 flex flex-col gap-4 lg:flex-row">

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddOption();
                }
              }}
              placeholder="Add new option..."
              className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-5 text-lg outline-none transition focus:border-purple-500"
            />

            <button
              onClick={handleAddOption}
              disabled={!input.trim()}
              className={`rounded-2xl px-10 py-5 text-xl font-bold transition

              ${!input.trim()
                ? "cursor-not-allowed bg-zinc-700 text-zinc-400"
                : "bg-gradient-to-r from-purple-500 to-violet-600 hover:scale-105"
              }
              `}
            >
              Add Option
            </button>

          </div>

          {/* MAIN GRID */}
          <div className="mt-10 grid grid-cols-1 gap-8 xl:grid-cols-[1.4fr_1fr]">

            {/* SPINNER */}
            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-10">

              <div className="flex flex-col items-center justify-center">

                <button
                  onClick={handleSpin}
                  disabled={isSpinning}
                  className={`flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-violet-600 text-4xl font-black shadow-[0_0_60px_rgba(168,85,247,0.5)] transition duration-300

                  ${isSpinning
                    ? "scale-110 animate-pulse"
                    : "hover:scale-105"
                  }
                  `}
                >
                  SPIN
                </button>

                <div className="mt-12 w-full rounded-3xl border border-white/10 bg-black/20 p-8 text-center">

                  <p className="text-xl text-zinc-400">

                    Selected Result

                  </p>

                  <h2 className="mt-4 text-5xl font-black text-purple-400">

                    {result}

                  </h2>

                </div>

              </div>

            </div>

            {/* OPTIONS */}
            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8">

              <div className="flex items-center justify-between">

                <h2 className="text-4xl font-black">

                  Options

                </h2>

                <p className="text-lg text-purple-400">

                  {options.length} Items

                </p>

              </div>

              <div className="mt-8 space-y-4 max-h-[500px] overflow-y-auto pr-2">

                {options.map((option, index) => (

                  <div
                    key={index}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-6 py-5"
                  >

                    <p className="text-xl">

                      {option}

                    </p>

                    <button
                      onClick={() =>
                        handleDeleteOption(index)
                      }
                      className="rounded-xl bg-red-500/10 px-4 py-2 text-red-400 transition hover:bg-red-500/20"
                    >
                      Delete
                    </button>

                  </div>

                ))}

              </div>

            </div>

          </div>

          {/* PARTICIPANTS */}
          <div className="mt-10 rounded-[32px] border border-white/10 bg-white/[0.04] p-8">

            <div className="flex items-center justify-between">

              <h2 className="text-4xl font-black">

                Participants

              </h2>

              <p className="text-lg text-green-400">

                {
                  participants.filter(
                    (p) => p.status === "Online"
                  ).length
                } Online

              </p>

            </div>

            <div className="mt-8 space-y-4">

              {participants.map((participant, index) => (

                <div
                  key={index}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-6 py-5"
                >

                  <div className="flex items-center gap-5">

                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-violet-600 text-xl font-bold">

                      {participant.name[0]}

                    </div>

                    <div>

                      <h2 className="text-xl font-semibold">

                        {participant.name}

                      </h2>

                      <p
                        className={
                          participant.status === "Online"
                            ? "text-green-400"
                            : "text-zinc-500"
                        }
                      >
                        {participant.status}
                      </p>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* HISTORY */}
          <div className="mt-10 rounded-[32px] border border-white/10 bg-white/[0.04] p-8">

            <div className="flex items-center justify-between">

              <h2 className="text-4xl font-black">

                Spin History

              </h2>

              <button
                onClick={() => {

                  setHistoryData([]);

                  setResult("-");

                  toast.success("History cleared");
                }}
                className="text-lg text-red-400 transition hover:text-red-300"
              >
                Clear
              </button>

            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-6">

              {historyData.length === 0 ? (

                <p className="text-center text-lg text-zinc-500">

                  No spin history yet.

                </p>

              ) : (

                <div className="space-y-3">

                  {historyData.map((item, index) => (

                    <div
                      key={index}
                      className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-lg"
                    >
                      {item}
                    </div>

                  ))}

                </div>

              )}

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}