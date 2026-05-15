"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { io, Socket } from "socket.io-client";
import ThemeToggle from "@/components/ThemeToggle";
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
  Plus,
  RotateCcw,
  Settings,
  Shuffle,
  Trash2,
  Trophy,
  Unlock,
  Users,
  Zap,
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
  const [wheelRotation, setWheelRotation] = useState(0);
  const [copied, setCopied] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [realTimeParticipants, setRealTimeParticipants] = useState<string[]>([]);

  const currentUser = profile?.name || "Guest";
  const options = roomState.options;
  const historyData = roomState.history;
  const visibleWheelOptions = useMemo(() => options.slice(0, 5), [options]);
  const roomLink = typeof window === "undefined" ? "" : `${window.location.origin}/room/${encodeURIComponent(roomCode)}`;
  const participants = [
    { name: currentUser, status: "Online", role: "Host" },
    ...realTimeParticipants.map(name => ({ name, status: "Online" as const, role: "Member" as const }))
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

  // WebSocket connection for real-time participants
  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const newSocket = io(backendUrl);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket");
      newSocket.emit("joinRoom", { roomId: roomCode, userName: currentUser });
    });

    newSocket.on("userJoined", (userName: string) => {
      setRealTimeParticipants((prev) => [...prev.filter(p => p !== userName), userName]);
      toast.success(`${userName} joined the room`);
    });

    newSocket.on("userLeft", (userName: string) => {
      setRealTimeParticipants((prev) => prev.filter(p => p !== userName));
      toast(`${userName} left the room`);
    });

    return () => {
      newSocket.disconnect();
    };
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
    let animationRotation = wheelRotation;
    const interval = window.setInterval(() => {
      animationRotation += 30 + Math.floor(Math.random() * 15);
      setWheelRotation(animationRotation);
      setResult(pickWeighted(options));
    }, 80);

    setTimeout(() => {
      window.clearInterval(interval);
      const finalResult = pickWeighted(options);
      setWheelRotation((prev) => prev + 720 + Math.floor(Math.random() * 360));
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
    <main className="min-h-screen bg-slate-950 text-white">
      <Toaster position="top-right" />

      <div className="mx-auto flex min-h-screen max-w-[1800px] gap-6 p-3 lg:p-6">
        <aside className="hidden w-[300px] shrink-0 flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-7 shadow-[0_12px_48px_rgba(0,0,0,0.2)] backdrop-blur-xl lg:flex">
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">Spin-Yuk</h1>

          <nav className="mt-12 space-y-2">
            <Link href="/dashboard" className="flex w-full items-center gap-3.5 rounded-xl bg-gradient-to-r from-violet-500/30 to-purple-500/20 border border-violet-400/20 px-5 py-3.5 text-left font-semibold text-slate-100 shadow-[0_8px_24px_rgba(139,92,246,0.15)] transition hover:from-violet-500/40 hover:to-purple-500/30">
              <Home size={20} strokeWidth={1.5} />
              Dashboard
            </Link>
            <Link href="/rooms" className="flex w-full items-center gap-3.5 rounded-xl px-5 py-3.5 text-left text-slate-400 transition hover:bg-white/5 hover:text-slate-200 hover:border hover:border-white/10">
              <Users size={20} strokeWidth={1.5} />
              Rooms
            </Link>
            <Link href="/history" className="flex w-full items-center gap-3.5 rounded-xl px-5 py-3.5 text-left text-slate-400 transition hover:bg-white/5 hover:text-slate-200 hover:border hover:border-white/10">
              <Clock3 size={20} strokeWidth={1.5} />
              History
            </Link>
            <Link href="/settings" className="flex w-full items-center gap-3.5 rounded-xl px-5 py-3.5 text-left text-slate-400 transition hover:bg-white/5 hover:text-slate-200 hover:border hover:border-white/10">
              <Settings size={20} strokeWidth={1.5} />
              Settings
            </Link>
          </nav>

          <div className="mt-auto space-y-4 rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3.5">
              {profile?.picture ? (
                <Image src={profile.picture} alt={currentUser} width={56} height={56} className="h-12 w-12 rounded-full object-cover shadow-md" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center flex-shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-lg font-black shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                  {currentUser[0]}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-100">{currentUser}</p>
                <p className="text-xs text-emerald-400 font-medium mt-0.5">{profile ? "✓ Google synced" : "Local"}</p>
              </div>
            </div>
            {!profile && (
              <button
                type="button"
                onClick={handleDemoGoogleLogin}
                className="w-full rounded-lg border border-violet-400/30 bg-violet-500/10 px-4 py-2.5 text-sm font-semibold text-violet-300 transition hover:bg-violet-500/20 hover:border-violet-400/50"
              >
                Connect Google
              </button>
            )}
          </div>
        </aside>

        <section className="flex-1 space-y-6 py-3 lg:py-6">
          <header className="flex flex-col gap-5 rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 sm:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.2)] xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                {profile ? `Welcome back, ${profile.name}!` : "Welcome to Spin-Yuk!"}
              </h2>
              <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-400">
                {profile ? "Your collaborative spinner is ready to use." : "Room data syncs across tabs and stays private."}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-4">
              <ThemeToggle />
              <div className="rounded-lg border border-white/10 bg-white/5 px-5 py-3.5 sm:px-6">
                <p className="text-xs sm:text-sm font-medium text-slate-500">Room Code</p>
                <div className="mt-3 flex flex-wrap items-center gap-3 sm:gap-4">
                  <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">{roomCode}</p>
                  <button
                    type="button"
                    onClick={handleCopyRoomLink}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(139,92,246,0.25)] transition hover:shadow-[0_12px_28px_rgba(139,92,246,0.35)]"
                  >
                    {copied ? <Clipboard size={16} strokeWidth={2} /> : <Copy size={16} strokeWidth={2} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
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
              <div key={card.label} className="flex flex-col gap-4 rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 sm:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition hover:border-violet-400/30 hover:bg-gradient-to-br hover:from-white/[0.08] hover:to-white/[0.03] hover:shadow-[0_12px_40px_rgba(139,92,246,0.15)]">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/30 to-violet-500/10 text-violet-300 shadow-[0_4px_16px_rgba(139,92,246,0.25)]">
                    <card.icon size={24} strokeWidth={1.5} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">{card.label}</p>
                  <p className="mt-3 text-3xl sm:text-4xl font-black text-white">{card.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-5 xl:grid-cols-[1fr_490px]">
            <div className="space-y-5">
              <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 sm:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                <div className="mb-6 grid gap-3 md:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => updateRoom((current) => ({ ...current, locked: !current.locked }))}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:border-white/20 hover:text-white"
                  >
                    {roomState.locked ? <Unlock size={17} strokeWidth={1.5} /> : <Lock size={17} strokeWidth={1.5} />}
                    {roomState.locked ? "Unlock Room" : "Lock Room"}
                  </button>
                  <button
                    type="button"
                    onClick={() => updateRoom((current) => ({ ...current, removeWinner: !current.removeWinner }))}
                    className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold transition ${
                      roomState.removeWinner ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/25" : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:border-white/20"
                    }`}
                  >
                    <Shuffle size={17} strokeWidth={1.5} />
                    Remove Winner
                  </button>
                  <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-500 font-medium">
                    Synced: {new Date(roomState.updatedAt).toLocaleTimeString()}
                  </div>
                </div>

                <div className="grid gap-3 lg:grid-cols-[1fr_80px_150px_130px_auto]">
                  <input
                    type="text"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") handleAddOrUpdateOption();
                    }}
                    placeholder={editingId ? "Edit option name..." : roomState.locked ? "Room locked by host" : "Add new option..."}
                    disabled={roomState.locked}
                    className="min-h-11 rounded-lg border border-white/10 bg-white/5 px-4 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/40 focus:bg-white/8 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={weight}
                    onChange={(event) => setWeight(Number(event.target.value))}
                    disabled={roomState.locked}
                    className="min-h-11 rounded-lg border border-white/10 bg-white/5 px-3 text-center text-white outline-none transition focus:border-violet-400/40 focus:bg-white/8 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Option chance weight"
                  />
                  <label className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-sm font-semibold text-slate-400 transition ${roomState.locked ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-white/20 hover:bg-white/8 hover:text-slate-300"}`}>
                    <ImagePlus size={17} strokeWidth={1.5} />
                    {imagePreview ? "Change" : "Image"}
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
                      className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/20 hover:border-red-500/40 disabled:cursor-not-allowed disabled:opacity-50"
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
                    className={`inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 font-bold transition ${
                      input.trim() && !roomState.locked
                        ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-[0_8px_24px_rgba(139,92,246,0.3)] hover:shadow-[0_12px_32px_rgba(139,92,246,0.4)]"
                        : "cursor-not-allowed bg-slate-700/50 text-slate-500"
                    }`}
                  >
                    {editingId ? <Check size={17} strokeWidth={2} /> : <Plus size={17} strokeWidth={2.5} />}
                  </button>
                </div>

                {(editingId || imagePreview) && (
                  <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
                    {imagePreview ? (
                      <Image src={imagePreview} alt="Option preview" width={56} height={56} unoptimized className="h-14 w-14 rounded-lg object-cover shadow-md" />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white/5 text-slate-600">
                        <ImagePlus size={20} strokeWidth={1.5} />
                      </div>
                    )}
                    <p className="text-sm text-slate-500">
                      {editingId ? "Editing option. Weight controls selection chance." : "Image preview ready."}
                    </p>
                    <button type="button" onClick={resetForm} className="ml-auto rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-white/15 hover:text-slate-300">
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="grid gap-6 rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 sm:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.2)] xl:grid-cols-[460px_1fr]">
                <div>
                  <h3 className="text-xl font-black">Spinner</h3>
                  <div
                    className="relative mx-auto mt-4 flex aspect-square max-w-[390px] items-center justify-center rounded-full border-[5px] border-purple-500 bg-[conic-gradient(from_20deg,#8b5cf6_0_20%,#2563eb_20%_40%,#22c55e_40%_60%,#f59e0b_60%_80%,#ef4444_80%_100%)] shadow-[0_0_38px_rgba(124,58,237,0.72)] transition-transform duration-200"
                    style={{ transform: `rotate(${wheelRotation}deg)` }}
                  >
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

                  <div className="mt-6 flex items-center gap-4 rounded-xl border border-white/10 bg-gradient-to-r from-white/5 to-white/[0.02] p-5 sm:p-6 shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
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
                      <p className="font-semibold text-slate-200">Selected Result</p>
                      <p className="mt-1 text-2xl font-black text-purple-300">{resultText}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate-400">
                    Weighted spin uses each option chance. Remove Winner mode deletes the selected item after spin.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <h3 className="text-xl font-black">
                      Options <span className="text-slate-500">({options.length})</span>
                    </h3>
                    <button
                      type="button"
                      onClick={handleClearOptions}
                      disabled={roomState.locked}
                      className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm font-semibold text-slate-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <RotateCcw size={15} strokeWidth={2} />
                      Clear
                    </button>
                  </div>
                  <div className="max-h-[480px] space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                    {options.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">
                        <List size={32} className="mx-auto mb-3 text-slate-600" strokeWidth={1.5} />
                        <p className="text-sm font-medium text-slate-500">No options yet</p>
                        <p className="mt-1.5 text-xs text-slate-600">Add your first option to get started</p>
                      </div>
                    ) : (
                      options.map((option) => (
                        <div
                          key={option.id}
                          draggable={!roomState.locked}
                          onDragStart={() => handleDragStart(option.id)}
                          onDragOver={(event) => event.preventDefault()}
                          onDrop={() => handleDrop(option.id)}
                          className={`flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-gradient-to-r from-white/5 to-white/[0.02] px-4 py-3.5 transition ${
                            draggingId === option.id ? "opacity-50" : "hover:border-white/20 hover:bg-gradient-to-r hover:from-white/8 hover:to-white/[0.03]"
                          }`}
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <GripVertical className={`flex-shrink-0 ${roomState.locked ? "text-slate-700" : "cursor-grab text-slate-600 hover:text-slate-500"}`} size={18} strokeWidth={1.5} />
                            {option.image ? (
                              <Image
                                src={option.image}
                                alt={option.label}
                                width={48}
                                height={48}
                                unoptimized
                                className="h-12 w-12 flex-shrink-0 rounded-lg object-cover shadow-md"
                              />
                            ) : (
                              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-white/5 text-slate-600">
                                <Zap size={18} strokeWidth={1.5} />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-slate-100">{option.label}</p>
                              <p className="text-xs text-slate-500 mt-0.5">Weight: {option.weight}x</p>
                            </div>
                          </div>
                          <div className="flex flex-shrink-0 items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditOption(option)}
                              className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-500 transition hover:bg-white/10 hover:text-slate-300 hover:border-white/20"
                              aria-label={`Edit ${option.label}`}
                            >
                              <Edit3 size={16} strokeWidth={2} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteOption(option.id)}
                              className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-400 transition hover:bg-red-500/20 hover:border-red-500/40"
                              aria-label={`Delete ${option.label}`}
                            >
                              <Trash2 size={16} strokeWidth={2} />
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
              <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 sm:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                <div className="flex items-center justify-between gap-3 mb-6">
                  <h3 className="text-xl font-black">Participants</h3>
                  <span className="rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1.5 text-sm font-bold text-emerald-300">{onlineCount} Online</span>
                </div>
                <div className="space-y-3">
                  {participants.map((participant) => (
                    <div key={participant.name} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/8 transition">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-lg font-black shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                        {participant.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-100">{participant.name}</p>
                        <p className={participant.status === "Online" ? "text-xs font-medium text-emerald-400 mt-0.5" : "text-xs text-slate-500 mt-0.5"}>
                          {participant.status === "Online" ? "🟢" : "⚫"} {participant.status} • {participant.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 sm:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-600 font-semibold">Premium Feature</p>
                <h3 className="mt-3 text-xl font-black text-slate-100">Google Workspace</h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-400">
                  Connect Google to keep your room history, sync across devices, and personalize your experience.
                </p>
                {!profile && (
                  <button
                    type="button"
                    onClick={handleDemoGoogleLogin}
                    className="mt-5 w-full rounded-lg bg-gradient-to-r from-violet-500/20 to-purple-500/10 border border-violet-400/20 px-4 py-3 text-sm font-bold text-violet-300 transition hover:from-violet-500/30 hover:to-purple-500/20 hover:border-violet-400/40"
                  >
                    Try Demo Connection
                  </button>
                )}
              </div>

              <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 sm:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div className="flex items-center gap-3">
                    <History className="text-violet-400" size={24} strokeWidth={1.5} />
                    <h3 className="text-xl font-black text-slate-100">History</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      updateRoom((current) => ({ ...current, history: [] }));
                      setResult(null);
                      toast.success("History cleared");
                    }}
                    className="text-xs sm:text-sm font-semibold text-slate-500 transition hover:text-red-400"
                  >
                    Clear
                  </button>
                </div>
                <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-5 sm:p-6">
                  {historyData.length === 0 ? (
                    <div className="py-8 text-center">
                      <Clock3 className="mx-auto mb-3 text-slate-600" size={36} strokeWidth={1.5} />
                      <p className="text-slate-500 font-medium">No spin history yet</p>
                      <p className="mt-2 text-sm text-slate-600">Results will appear here as you spin</p>
                    </div>
                  ) : (
                    <div className="max-h-[320px] space-y-2 overflow-y-auto pr-2">
                      {historyData.slice(0, 10).map((item) => (
                        <div key={item.id} className="flex items-center gap-3 rounded-lg bg-white/5 px-4 py-3 hover:bg-white/8 transition text-sm">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.label}
                              width={40}
                              height={40}
                              unoptimized
                              className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/5 text-slate-600">
                              <Trophy size={16} strokeWidth={1.5} />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold text-slate-100">{item.label}</p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {item.spunBy} • {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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

          <p className="pb-3 text-center text-xs sm:text-sm text-slate-600 font-medium">© 2026 Spin-Yuk. Collaborative decision-making, made fun and fair.</p>
        </section>
      </div>
    </main>
  );
}
