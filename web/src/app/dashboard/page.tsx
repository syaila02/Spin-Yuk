"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import {
  BarChart3,
  Check,
  Clipboard,
  Clock3,
  Copy,
  Edit3,
  GripVertical,
  History,
  Home,
  ImagePlus,
  LayoutDashboard,
  List,
  Lock,
  RotateCcw,
  Settings,
  Shuffle,
  Trash2,
  Trophy,
  Unlock,
  Users,
} from "lucide-react";

type SpinnerOption = {
  id: string;
  label: string;
  image?: string;
  weight: number;
};

type HistoryItem = {
  id: string;
  label: string;
  image?: string;
  createdAt: string;
  spunBy: string;
  optionCount: number;
};

type RoomState = {
  name: string;
  locked: boolean;
  removeWinner: boolean;
  options: SpinnerOption[];
  history: HistoryItem[];
  updatedAt: string;
};

type GoogleProfile = {
  name: string;
  email: string;
  picture?: string;
};

const roomFallback = "SPIN-2026";
const defaultOptions: SpinnerOption[] = ["Pizza", "Burger", "Sushi", "Mie Ayam", "Nasi Goreng"].map((label, index) => ({
  id: `default-${index}`,
  label,
  weight: 1,
}));

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function defaultRoomState(roomCode: string): RoomState {
  return {
    name: `Room ${roomCode}`,
    locked: false,
    removeWinner: false,
    options: defaultOptions,
    history: [],
    updatedAt: new Date().toISOString(),
  };
}

function getRoomKey(roomCode: string) {
  return `spin-yuk-room-${roomCode}`;
}

function normalizeOption(item: unknown, index: number): SpinnerOption | null {
  if (typeof item === "string") return { id: `migrated-${index}-${item}`, label: item, weight: 1 };
  if (!item || typeof item !== "object") return null;

  const value = item as Partial<SpinnerOption>;
  if (!value.id || !value.label) return null;

  return {
    id: value.id,
    label: value.label,
    image: value.image,
    weight: Math.max(1, Math.min(20, Number(value.weight) || 1)),
  };
}

function readRoomState(roomCode: string): RoomState {
  if (typeof window === "undefined") return defaultRoomState(roomCode);

  try {
    const savedRoom = window.localStorage.getItem(getRoomKey(roomCode));
    if (savedRoom) {
      const parsed = JSON.parse(savedRoom) as Partial<RoomState>;
      return {
        name: parsed.name || `Room ${roomCode}`,
        locked: Boolean(parsed.locked),
        removeWinner: Boolean(parsed.removeWinner),
        options: Array.isArray(parsed.options)
          ? parsed.options.map(normalizeOption).filter((item): item is SpinnerOption => Boolean(item))
          : defaultOptions,
        history: Array.isArray(parsed.history) ? parsed.history.filter((item): item is HistoryItem => Boolean(item?.id && item?.label)) : [],
        updatedAt: parsed.updatedAt || new Date().toISOString(),
      };
    }

    const savedNewOptions = window.localStorage.getItem("spin-yuk-options");
    if (savedNewOptions) {
      const parsed = JSON.parse(savedNewOptions);
      if (Array.isArray(parsed)) {
        return {
          ...defaultRoomState(roomCode),
          options: parsed.map(normalizeOption).filter((item): item is SpinnerOption => Boolean(item)),
        };
      }
    }

    const savedOldOptions = window.localStorage.getItem("spin-options");
    const parsedOldOptions = savedOldOptions ? JSON.parse(savedOldOptions) : [];
    if (Array.isArray(parsedOldOptions) && parsedOldOptions.length > 0) {
      return {
        ...defaultRoomState(roomCode),
        options: parsedOldOptions.map(normalizeOption).filter((item): item is SpinnerOption => Boolean(item)),
      };
    }
  } catch {
    return defaultRoomState(roomCode);
  }

  return defaultRoomState(roomCode);
}

function readGoogleProfile(): GoogleProfile | null {
  if (typeof window === "undefined") return null;

  try {
    const saved = window.localStorage.getItem("spin-yuk-google-profile");
    return saved ? (JSON.parse(saved) as GoogleProfile) : null;
  } catch {
    return null;
  }
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function randomUnit() {
  if (typeof crypto === "undefined") return Math.random();
  const value = new Uint32Array(1);
  crypto.getRandomValues(value);
  return value[0] / 2 ** 32;
}

function pickWeighted(options: SpinnerOption[]) {
  const totalWeight = options.reduce((sum, option) => sum + Math.max(1, option.weight), 0);
  let cursor = randomUnit() * totalWeight;

  for (const option of options) {
    cursor -= Math.max(1, option.weight);
    if (cursor <= 0) return option;
  }

  return options[options.length - 1];
}

export default function DashboardPage() {
  const params = useParams<{ code?: string }>();
  const roomCode = params?.code ? decodeURIComponent(params.code).toUpperCase() : roomFallback;
  const [roomState, setRoomState] = useState(() => readRoomState(roomCode));
  const [profile, setProfile] = useState<GoogleProfile | null>(readGoogleProfile);
  const [input, setInput] = useState("");
  const [weight, setWeight] = useState(1);
  const [imagePreview, setImagePreview] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [result, setResult] = useState<SpinnerOption | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentUser = profile?.name || "Kibar";
  const options = roomState.options;
  const historyData = roomState.history;
  const visibleWheelOptions = useMemo(() => options.slice(0, 5), [options]);
  const roomLink = typeof window === "undefined" ? "" : `${window.location.origin}/room/${encodeURIComponent(roomCode)}`;
  const participants = [
    { name: currentUser, status: "Online", role: "Host" },
    { name: "Syaila", status: "Online", role: "Member" },
    { name: "Auliya", status: "Offline", role: "Member" },
  ];
  const onlineCount = participants.filter((participant) => participant.status === "Online").length;
  const resultText = result?.label ?? "-";

  useEffect(() => {
    localStorage.setItem(getRoomKey(roomCode), JSON.stringify(roomState));
    localStorage.setItem("spin-yuk-options", JSON.stringify(roomState.options));
    localStorage.setItem("spin-yuk-history-items", JSON.stringify(roomState.history));
    localStorage.setItem("spin-options", JSON.stringify(roomState.options.map((option) => option.label)));
    localStorage.setItem("spin-history", JSON.stringify(roomState.history.map((item) => item.label)));
  }, [roomCode, roomState]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== getRoomKey(roomCode) || !event.newValue) return;

      try {
        const nextState = JSON.parse(event.newValue) as RoomState;
        setRoomState((current) => {
          if (JSON.stringify(current) === event.newValue) return current;

          toast.success("Room synced from another tab");
          return nextState;
        });
      } catch {
        toast.error("Unable to sync room update");
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [roomCode]);

  const updateRoom = (updater: (current: RoomState) => RoomState) => {
    setRoomState((current) => ({ ...updater(current), updatedAt: new Date().toISOString() }));
  };

  const resetForm = () => {
    setInput("");
    setWeight(1);
    setImagePreview("");
    setEditingId(null);
  };

  const guardUnlocked = () => {
    if (!roomState.locked) return true;
    toast.error("Room is locked by host");
    return false;
  };

  const handleImageChange = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 750 * 1024) {
      toast.error("Image size max 750 KB for offline storage");
      return;
    }

    setImagePreview(await fileToDataUrl(file));
  };

  const handleAddOrUpdateOption = () => {
    if (!guardUnlocked()) return;

    const value = input.trim();
    const nextWeight = Math.max(1, Math.min(20, Number(weight) || 1));

    if (!value) {
      toast.error("Option cannot be empty");
      return;
    }

    const duplicate = options.some((option) => option.label.toLowerCase() === value.toLowerCase() && option.id !== editingId);
    if (duplicate) {
      toast.error("Option already exists");
      return;
    }

    if (editingId) {
      updateRoom((current) => ({
        ...current,
        options: current.options.map((option) =>
          option.id === editingId ? { ...option, label: value, image: imagePreview || option.image, weight: nextWeight } : option
        ),
      }));
      toast.success("Option updated");
    } else {
      updateRoom((current) => ({
        ...current,
        options: [...current.options, { id: createId("option"), label: value, image: imagePreview || undefined, weight: nextWeight }],
      }));
      toast.success("Option added");
    }

    resetForm();
  };

  const handleEditOption = (option: SpinnerOption) => {
    if (!guardUnlocked()) return;
    setEditingId(option.id);
    setInput(option.label);
    setWeight(option.weight);
    setImagePreview(option.image ?? "");
  };

  const handleDeleteOption = (id: string) => {
    if (!guardUnlocked()) return;
    updateRoom((current) => ({ ...current, options: current.options.filter((option) => option.id !== id) }));
    if (editingId === id) resetForm();
    toast.success("Option deleted");
  };

  const handleClearOptions = () => {
    if (!guardUnlocked()) return;
    updateRoom((current) => ({ ...current, options: [] }));
    setResult(null);
    resetForm();
    toast.success("All options cleared");
  };

  const handleDragStart = (id: string) => {
    if (!roomState.locked) setDraggingId(id);
  };

  const handleDrop = (targetId: string) => {
    if (!draggingId || draggingId === targetId || roomState.locked) return;

    const oldIndex = options.findIndex((option) => option.id === draggingId);
    const newIndex = options.findIndex((option) => option.id === targetId);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...options];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    updateRoom((current) => ({ ...current, options: reordered }));
    setDraggingId(null);
    toast.success("Option order updated");
  };

  const handleSpin = () => {
    if (options.length === 0) {
      toast.error("Please add at least one option before spinning.");
      return;
    }
    if (isSpinning) return;

    setIsSpinning(true);
    const interval = setInterval(() => setResult(pickWeighted(options)), 90);

    setTimeout(() => {
      clearInterval(interval);
      const finalResult = pickWeighted(options);
      setResult(finalResult);
      updateRoom((current) => ({
        ...current,
        options: current.removeWinner ? current.options.filter((option) => option.id !== finalResult.id) : current.options,
        history: [
          {
            id: createId("history"),
            label: finalResult.label,
            image: finalResult.image,
            createdAt: new Date().toISOString(),
            spunBy: currentUser,
            optionCount: current.options.length,
          },
          ...current.history,
        ],
      }));
      setIsSpinning(false);
      toast.success(`Selected: ${finalResult.label}`);
    }, 2400);
  };

  const handleCopyRoomLink = async () => {
    try {
      await navigator.clipboard.writeText(roomLink || roomCode);
      setCopied(true);
      toast.success("Room link copied");
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Unable to copy room link");
    }
  };

  const handleDemoGoogleLogin = () => {
    const demoProfile = {
      name: "Google User",
      email: "google.user@example.com",
    };
    localStorage.setItem("spin-yuk-google-profile", JSON.stringify(demoProfile));
    setProfile(demoProfile);
    toast.success("Google profile connected for demo");
  };

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <Toaster position="top-right" />

      <div className="mx-auto flex min-h-screen max-w-[1800px] gap-6 p-3 lg:p-0">
        <aside className="hidden w-[310px] shrink-0 flex-col rounded-[22px] border border-white/10 bg-[#090b1a]/95 p-8 shadow-[0_30px_120px_rgba(0,0,0,0.35)] lg:flex">
          <h1 className="text-4xl font-black tracking-tight text-purple-400">Spin-Yuk</h1>

          <nav className="mt-10 space-y-4">
            <button className="flex w-full items-center gap-4 rounded-xl bg-gradient-to-r from-purple-600 to-violet-700 px-5 py-4 text-left font-semibold shadow-[0_18px_45px_rgba(124,58,237,0.28)]">
              <Home size={22} />
              Dashboard
            </button>
            <button className="flex w-full items-center gap-4 rounded-xl px-5 py-4 text-left text-zinc-300 transition hover:bg-white/5 hover:text-white">
              <Users size={22} />
              Rooms
            </button>
            <button className="flex w-full items-center gap-4 rounded-xl px-5 py-4 text-left text-zinc-300 transition hover:bg-white/5 hover:text-white">
              <Clock3 size={22} />
              History
            </button>
            <button className="flex w-full items-center gap-4 rounded-xl px-5 py-4 text-left text-zinc-300 transition hover:bg-white/5 hover:text-white">
              <Settings size={22} />
              Settings
            </button>
          </nav>

          <div className="mt-auto space-y-3 rounded-2xl border border-white/10 bg-[#0f1325] p-4">
            <div className="flex items-center gap-4">
              {profile?.picture ? (
                <Image src={profile.picture} alt={currentUser} width={56} height={56} className="h-14 w-14 rounded-full object-cover" />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-violet-700 text-2xl font-black shadow-[0_0_25px_rgba(124,58,237,0.65)]">
                  {currentUser[0]}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate font-semibold">{currentUser}</p>
                <p className="text-sm text-green-400">{profile ? "Google synced" : "Local host"}</p>
              </div>
            </div>
            {!profile && (
              <button
                type="button"
                onClick={handleDemoGoogleLogin}
                className="w-full rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-200 transition hover:bg-purple-500/20"
              >
                Connect Google demo
              </button>
            )}
          </div>
        </aside>

        <section className="flex-1 space-y-5 py-3 lg:py-6 lg:pr-5">
          <header className="flex flex-col gap-5 rounded-xl border border-white/10 bg-[#0b0f20]/95 p-6 shadow-[0_22px_80px_rgba(0,0,0,0.25)] xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Welcome back, {currentUser}!</h2>
              <p className="mt-3 text-lg text-zinc-400">Collaborative room state is saved per room and syncs across browser tabs.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#0d1022] p-5">
              <p className="text-sm text-zinc-400">Room Code</p>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <p className="text-3xl font-black text-purple-400">{roomCode}</p>
                <button
                  type="button"
                  onClick={handleCopyRoomLink}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-violet-700 px-4 py-3 text-sm font-semibold shadow-[0_18px_45px_rgba(124,58,237,0.25)] transition hover:scale-[1.02]"
                >
                  {copied ? <Clipboard size={18} /> : <Copy size={18} />}
                  {copied ? "Copied" : "Copy Code"}
                </button>
              </div>
            </div>
          </header>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Total Options", value: options.length, icon: List },
              { label: "Participants", value: participants.length, icon: Users },
              { label: "Spinner Status", value: isSpinning ? "Spinning" : roomState.locked ? "Locked" : "Ready", icon: LayoutDashboard },
              { label: "Total Spins", value: historyData.length, icon: BarChart3 },
            ].map((card) => (
              <div key={card.label} className="flex items-center gap-5 rounded-xl border border-white/10 bg-[#0b0f20]/95 p-6 shadow-[0_22px_80px_rgba(0,0,0,0.18)]">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-600/40 text-white shadow-[0_0_28px_rgba(124,58,237,0.45)]">
                  <card.icon size={28} />
                </div>
                <div>
                  <p className="text-zinc-400">{card.label}</p>
                  <p className="mt-2 text-3xl font-black text-white">{card.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-5 xl:grid-cols-[1fr_490px]">
            <div className="space-y-5">
              <div className="rounded-xl border border-white/10 bg-[#0b0f20]/95 p-4 shadow-[0_22px_80px_rgba(0,0,0,0.18)]">
                <div className="mb-4 grid gap-3 md:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => updateRoom((current) => ({ ...current, locked: !current.locked }))}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold transition hover:bg-white/10"
                  >
                    {roomState.locked ? <Unlock size={17} /> : <Lock size={17} />}
                    {roomState.locked ? "Unlock Room" : "Lock Room"}
                  </button>
                  <button
                    type="button"
                    onClick={() => updateRoom((current) => ({ ...current, removeWinner: !current.removeWinner }))}
                    className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold transition ${
                      roomState.removeWinner ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-200" : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <Shuffle size={17} />
                    Remove Winner
                  </button>
                  <div className="rounded-lg border border-white/10 bg-[#080b18] px-4 py-3 text-sm text-zinc-400">
                    Last sync: {new Date(roomState.updatedAt).toLocaleTimeString()}
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1fr_92px_170px_130px_auto]">
                  <input
                    type="text"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") handleAddOrUpdateOption();
                    }}
                    placeholder={editingId ? "Edit option name..." : roomState.locked ? "Room locked by host" : "Add new option..."}
                    disabled={roomState.locked}
                    className="min-h-12 rounded-lg border border-white/10 bg-[#080b18] px-4 text-white outline-none transition placeholder:text-zinc-500 focus:border-purple-400 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={weight}
                    onChange={(event) => setWeight(Number(event.target.value))}
                    disabled={roomState.locked}
                    className="min-h-12 rounded-lg border border-white/10 bg-[#080b18] px-3 text-white outline-none transition focus:border-purple-400 disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label="Option chance weight"
                  />
                  <label className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-[#080b18] px-4 text-sm font-semibold text-zinc-300 transition ${roomState.locked ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-purple-400 hover:text-white"}`}>
                    <ImagePlus size={18} />
                    {imagePreview ? "Change Image" : "Add Image"}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={roomState.locked}
                      className="hidden"
                      onChange={(event) => {
                        void handleImageChange(event.target.files?.[0]);
                        event.target.value = "";
                      }}
                    />
                  </label>
                  {imagePreview ? (
                    <button
                      type="button"
                      onClick={() => setImagePreview("")}
                      disabled={roomState.locked}
                      className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Remove
                    </button>
                  ) : (
                    <div className="hidden lg:block" />
                  )}
                  <button
                    type="button"
                    onClick={handleAddOrUpdateOption}
                    disabled={!input.trim() || roomState.locked}
                    className={`inline-flex items-center justify-center gap-2 rounded-lg px-7 py-3 font-semibold transition ${
                      input.trim() && !roomState.locked
                        ? "bg-gradient-to-r from-purple-600 to-violet-700 shadow-[0_18px_45px_rgba(124,58,237,0.24)] hover:scale-[1.02]"
                        : "cursor-not-allowed bg-zinc-700 text-zinc-400"
                    }`}
                  >
                    {editingId ? <Check size={18} /> : <ImagePlus size={18} />}
                    {editingId ? "Save" : "Add"}
                  </button>
                </div>

                {(editingId || imagePreview) && (
                  <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-white/10 bg-[#080b18] p-3">
                    {imagePreview ? (
                      <Image src={imagePreview} alt="Option preview" width={56} height={56} unoptimized className="h-14 w-14 rounded-lg object-cover" />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white/5 text-zinc-500">
                        <ImagePlus size={20} />
                      </div>
                    )}
                    <p className="text-sm text-zinc-400">
                      {editingId ? "Editing option. Weight controls chance of being selected." : "Image preview ready."}
                    </p>
                    <button type="button" onClick={resetForm} className="ml-auto rounded-lg bg-white/5 px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/10">
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="grid gap-5 rounded-xl border border-white/10 bg-[#0b0f20]/95 p-6 shadow-[0_22px_80px_rgba(0,0,0,0.2)] xl:grid-cols-[440px_1fr]">
                <div>
                  <h3 className="text-xl font-black">Spinner</h3>
                  <div className="relative mx-auto mt-4 flex aspect-square max-w-[390px] items-center justify-center rounded-full border-[5px] border-purple-500 bg-[conic-gradient(from_20deg,#8b5cf6_0_20%,#2563eb_20%_40%,#22c55e_40%_60%,#f59e0b_60%_80%,#ef4444_80%_100%)] shadow-[0_0_38px_rgba(124,58,237,0.72)]">
                    <div className="absolute -top-4 left-1/2 h-12 w-12 -translate-x-1/2 rounded-full bg-purple-500 shadow-[0_0_28px_rgba(124,58,237,0.75)]" />
                    {visibleWheelOptions.map((option, index) => (
                      <div
                        key={option.id}
                        className={`absolute flex max-w-[94px] flex-col items-center gap-1 text-center text-xs font-bold text-white drop-shadow ${
                          index === 0
                            ? "top-[17%] left-[27%] -rotate-[35deg]"
                            : index === 1
                              ? "top-[18%] right-[23%] rotate-[35deg]"
                              : index === 2
                                ? "right-[10%] top-[49%] rotate-90"
                                : index === 3
                                  ? "bottom-[15%] left-[39%]"
                                  : "left-[10%] top-[50%] -rotate-[35deg]"
                        }`}
                      >
                        {option.image && (
                          <Image
                            src={option.image}
                            alt=""
                            width={40}
                            height={40}
                            unoptimized
                            className="h-10 w-10 rounded-full border border-white/40 object-cover"
                          />
                        )}
                        <span>{option.label}</span>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleSpin}
                      disabled={isSpinning}
                      className={`z-10 flex h-32 w-32 items-center justify-center rounded-full border-4 border-purple-500 bg-[#080b18] text-3xl font-black shadow-[0_0_35px_rgba(124,58,237,0.78)] transition ${
                        isSpinning ? "scale-110 animate-pulse" : "hover:scale-105"
                      }`}
                    >
                      SPIN
                    </button>
                  </div>

                  <div className="mt-6 flex items-center gap-4 rounded-xl border border-white/10 bg-[#111629] p-4">
                    {result?.image ? (
                      <Image
                        src={result.image}
                        alt={result.label}
                        width={56}
                        height={56}
                        unoptimized
                        className="h-14 w-14 rounded-full object-cover shadow-[0_0_28px_rgba(124,58,237,0.48)]"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-600/50 shadow-[0_0_28px_rgba(124,58,237,0.48)]">
                        <Trophy size={24} />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">Selected Result</p>
                      <p className="mt-1 text-2xl font-black text-purple-300">{resultText}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-zinc-500">
                    Weighted spin uses each option chance. Remove Winner mode deletes the selected item after spin.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-black">
                      Options <span className="text-zinc-500">({options.length})</span>
                    </h3>
                    <button
                      type="button"
                      onClick={handleClearOptions}
                      disabled={roomState.locked}
                      className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <RotateCcw size={15} />
                      Clear
                    </button>
                  </div>
                  <div className="mt-5 max-h-[420px] space-y-3 overflow-y-auto pr-2">
                    {options.length === 0 ? (
                      <p className="rounded-xl border border-dashed border-white/10 p-5 text-center text-zinc-500">No options yet.</p>
                    ) : (
                      options.map((option) => (
                        <div
                          key={option.id}
                          draggable={!roomState.locked}
                          onDragStart={() => handleDragStart(option.id)}
                          onDragOver={(event) => event.preventDefault()}
                          onDrop={() => handleDrop(option.id)}
                          className={`flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#111629] px-4 py-3 ${
                            draggingId === option.id ? "opacity-50" : ""
                          }`}
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <GripVertical className={roomState.locked ? "text-zinc-700" : "cursor-grab text-zinc-500"} size={18} />
                            {option.image ? (
                              <Image
                                src={option.image}
                                alt={option.label}
                                width={48}
                                height={48}
                                unoptimized
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/5 text-zinc-500">
                                <ImagePlus size={18} />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="truncate font-semibold">{option.label}</p>
                              <p className="text-xs text-zinc-500">Chance weight {option.weight}x</p>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditOption(option)}
                              className="rounded-lg border border-white/10 bg-white/5 p-2 text-zinc-300 transition hover:bg-white/10 hover:text-white"
                              aria-label={`Edit ${option.label}`}
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteOption(option.id)}
                              className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-300 transition hover:bg-red-500/20"
                              aria-label={`Delete ${option.label}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-xl border border-white/10 bg-[#0b0f20]/95 p-5 shadow-[0_22px_80px_rgba(0,0,0,0.18)]">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black">Participants</h3>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-bold text-emerald-300">{onlineCount} Online</span>
                </div>
                <div className="mt-5 space-y-3">
                  {participants.map((participant) => (
                    <div key={participant.name} className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#111629] p-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-violet-700 text-2xl font-black shadow-[0_0_25px_rgba(124,58,237,0.6)]">
                        {participant.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold">{participant.name}</p>
                        <p className={participant.status === "Online" ? "text-sm text-green-400" : "text-sm text-zinc-500"}>
                          {participant.status} - {participant.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#0b0f20]/95 p-5 shadow-[0_22px_80px_rgba(0,0,0,0.18)]">
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Google advantage</p>
                <h3 className="mt-3 text-xl font-black">Personal workspace</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Login Google lets Spin-Yuk attach host identity to spins, keep room history per account, and prepare backend sync across devices.
                </p>
                {!profile && (
                  <button
                    type="button"
                    onClick={handleDemoGoogleLogin}
                    className="mt-4 w-full rounded-lg bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Try Google profile demo
                  </button>
                )}
              </div>

              <div className="rounded-xl border border-white/10 bg-[#0b0f20]/95 p-5 shadow-[0_22px_80px_rgba(0,0,0,0.18)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <History className="text-purple-400" size={24} />
                    <h3 className="text-xl font-black">Spin History</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      updateRoom((current) => ({ ...current, history: [] }));
                      setResult(null);
                      toast.success("History cleared");
                    }}
                    className="text-sm font-semibold text-red-300 transition hover:text-red-200"
                  >
                    Clear
                  </button>
                </div>
                <div className="mt-5 rounded-xl border border-dashed border-purple-500/40 bg-[#0d1022] p-6">
                  {historyData.length === 0 ? (
                    <div className="py-8 text-center text-zinc-400">
                      <Clock3 className="mx-auto mb-4 text-purple-500" size={42} />
                      <p>No spin history yet.</p>
                      <p className="mt-2 text-sm">Your results will appear here.</p>
                    </div>
                  ) : (
                    <div className="max-h-[300px] space-y-3 overflow-y-auto pr-2">
                      {historyData.slice(0, 10).map((item) => (
                        <div key={item.id} className="flex items-center gap-3 rounded-lg bg-white/5 px-4 py-3 font-semibold">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.label}
                              width={40}
                              height={40}
                              unoptimized
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-zinc-500">
                              <Trophy size={16} />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="truncate">{item.label}</p>
                            <p className="text-xs font-normal text-zinc-500">
                              {item.spunBy} - {item.optionCount} options - {new Date(item.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <p className="pb-2 text-center text-sm text-zinc-500">2026 Spin-Yuk. All rights reserved.</p>
        </section>
      </div>
    </main>
  );
}
